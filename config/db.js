// Wrapper di accesso al DB usando Supabase.
// Fornisce un'interfaccia minimale simile a `prepare(...).run()`/`get()`
// per mantenere compatibilità con il codice originario che usava SQLite.
// Le query vengono mappate in chiamate a Supabase (insert/update/select).
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
}

async function initDb() {
    if (!supabase) {
        console.log('Supabase non configurato. Usa variabili SUPABASE_URL e SUPABASE_ANON_KEY');
        return null;
    }

    const { error } = await supabase.from('users').select('id').limit(1);
    if (error && error.code === '42P01') {
        console.log('Tabelle non trovate. Creando schema...');
        await createTables();
    }
    return supabase;
}

async function createTables() {
    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            dob TEXT NOT NULL,
            age INTEGER NOT NULL,
            sex TEXT NOT NULL CHECK(sex IN ('M', 'F')),
            is_premium INTEGER DEFAULT 0,
            premium_expires_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW()
        )`,
        `CREATE TABLE IF NOT EXISTS diets (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            goal TEXT NOT NULL CHECK(goal IN ('slim', 'muscle')),
            weight REAL NOT NULL,
            height REAL NOT NULL,
            activity_multiplier REAL NOT NULL,
            bmi REAL NOT NULL,
            target_weight REAL NOT NULL,
            ideal_min REAL NOT NULL,
            ideal_max REAL NOT NULL,
            calories INTEGER NOT NULL,
            protein_g INTEGER NOT NULL,
            carbs_g INTEGER NOT NULL,
            fat_g INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )`,
        `CREATE TABLE IF NOT EXISTS meal_plans (
            id SERIAL PRIMARY KEY,
            diet_id INTEGER NOT NULL REFERENCES diets(id) ON DELETE CASCADE,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            week_start TEXT NOT NULL,
            plan_json TEXT NOT NULL,
            generated_at TIMESTAMP DEFAULT NOW()
        )`
    ];

    for (const sql of queries) {
        const { error } = await supabase.rpc('pg_catalog.execute', { query: sql }).catch(() => ({ error: null }));
    }
}

function getClient() {
    return supabase;
}

module.exports = {
    initDb,
    getDb: () => supabase,
    isReady: () => supabase !== null,

    prepare(sql) {
        return {
            run(...params) {
                return executeQuery(sql, params);
            },
            get(...params) {
                return executeQuery(sql, params, true);
            }
        };
    }
};

async function executeQuery(sql, params, single = false) {
    if (!supabase) throw new Error('Supabase non inizializzato');

    const tableMatch = sql.match(/FROM\s+(\w+)/i) || sql.match(/INTO\s+(\w+)/i) || sql.match(/UPDATE\s+(\w+)/i);
    const tableName = tableMatch ? tableMatch[1] : null;

    if (!tableName) return { lastInsertRowid: 0, changes: 0 };

    // Determina il tipo di query (INSERT / UPDATE / SELECT) per mappare
    // la stringa SQL alla corrispondente operazione supabase.
    const isInsert = sql.trim().toUpperCase().startsWith('INSERT');
    const isUpdate = sql.trim().toUpperCase().startsWith('UPDATE');
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT');

    try {
        // Gestione INSERT: estrae colonne e valori dai placeholder e
        // invia un `insert` a Supabase, restituendo l'id creato.
        if (isInsert) {
            const columns = sql.match(/\(([^)]+)\)\s*VALUES/i)?.[1].split(',').map(c => c.trim());
            const obj = {};
            columns?.forEach((col, i) => { obj[col] = params[i]; });

            console.log('[DEBUG] INSERT:', { tableName, obj, columns, sql });
            const { data, error } = await supabase.from(tableName).insert(obj).select().single();
            if (error) {
                console.error('[DEBUG] INSERT error:', error);
                throw error;
            }
            return { lastInsertRowid: data?.id || 0, changes: error ? 0 : 1 };
        }

        // Gestione UPDATE: tenta di mappare SET e WHERE in un oggetto
        // da passare a Supabase .update(obj).eq(whereCol, whereVal).
        if (isUpdate) {
            const cleanedSql = sql.replace(/\n/g, ' ').replace(/\s+/g, ' ');
            
            const setMatch = cleanedSql.match(/SET\s+(.+?)\s+WHERE/i);
            const setPart = setMatch ? setMatch[1] : '';
            
            const setCols = [];
            const setParts = setPart.split(',');
            for (const sp of setParts) {
                const col = sp.split('=')[0].trim();
                if (col && col !== '?') setCols.push(col);
            }
            
            const whereMatch = cleanedSql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
            const whereCol = whereMatch ? whereMatch[1] : '';

            const obj = {};
            let paramIdx = 0;
            
            // Usa la lunghezza di params per determinare quanti valori vanno in SET
            const totalPlaceholders = (setPart.match(/\?/g) || []).length;
            const setParamCount = Math.min(totalPlaceholders, params.length - 1); // -1 per WHERE
            
            for (let i = 0; i < setParamCount; i++) {
                if (i < setCols.length && i < params.length) {
                    obj[setCols[i]] = params[i];
                    paramIdx++;
                }
            }

            const whereVal = params[paramIdx];

            console.log('[DEBUG] UPDATE:', { tableName, obj, setCols, whereCol, whereVal, params, setParamCount });
            const { error } = await supabase.from(tableName).update(obj).eq(whereCol, whereVal);
            if (error) {
                console.error('[DEBUG] UPDATE error:', error);
                throw error;
            }
            return { changes: error ? 0 : 1 };
        }

        // Gestione SELECT: prova a tradurre semplici WHERE/ORDER/LIMIT
        // in chiamate Supabase e restituisce risultati (array o singolo).
        if (isSelect) {
            console.log('[DEBUG] SELECT:', { tableName, sql, params });
            let query = supabase.from(tableName).select('*');

            const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/i);
            if (whereMatch) {
                const cond = whereMatch[1];
                const eqMatch = cond.match(/(\w+)\s*=\s*\?/);
                if (eqMatch) {
                    query = query.eq(eqMatch[1], params[0]);
                }
            }

            const orderMatch = sql.match(/ORDER BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
            if (orderMatch) {
                query = query.order(orderMatch[1], { ascending: orderMatch[2]?.toUpperCase() !== 'DESC' });
            }

            const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
            if (limitMatch) {
                query = query.limit(parseInt(limitMatch[1]));
            }

            const { data, error } = await query;
            console.log('[DEBUG] SELECT result:', { data, error });
            if (error) throw error;

            return single ? (data?.[0] || undefined) : (data || []);
        }

        return { lastInsertRowid: 0, changes: 0 };
    } catch (err) {
        console.error('DB error:', err.message);
        throw err;
    }
}