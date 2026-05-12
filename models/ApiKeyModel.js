const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = (supabaseUrl && serviceRoleKey) ? createClient(supabaseUrl, serviceRoleKey) : null;

const ApiKeyModel = {
    async create(userId, name = 'API Key') {
        if (!supabaseAdmin) throw new Error('Database not configured');
        const apiKey = 'np_' + crypto.randomBytes(24).toString('hex');
        const insertData = { user_id: userId, api_key: apiKey, name };

        const { data, error } = await supabaseAdmin
            .from('api_keys')
            .insert(insertData)
            .select();

        if (error) {
            throw new Error('Supabase error: ' + error.message);
        }

        if (!data || data.length === 0) {
            throw new Error('Insert returned no data');
        }

        return data[0];
    },

    async findByKey(apiKey) {
        if (!supabaseAdmin) return null;
        const { data, error } = await supabaseAdmin
            .from('api_keys')
            .select('*')
            .eq('api_key', apiKey)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    },

    async findAllByUser(userId) {
        const { data, error } = await supabaseAdmin
            .from('api_keys')
            .select('id, name, api_key, is_premium, premium_expires_at, created_at, last_used_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async countByUser(userId) {
        const { count, error } = await supabaseAdmin
            .from('api_keys')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        if (error) throw error;
        return count || 0;
    },

    async delete(id, userId) {
        if (!supabaseAdmin) return { changes: 0 };
        const { error } = await supabaseAdmin
            .from('api_keys')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw error;
        return { changes: 1 };
    },

    async updateLastUsed(id) {
        if (!supabaseAdmin) return { changes: 0 };
        const { error } = await supabaseAdmin
            .from('api_keys')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', id);
        if (error) throw error;
        return { changes: 1 };
    },

    async setPremium(id, isPremium, expiresAt = null) {
        if (!supabaseAdmin) return { changes: 0 };
        const updateData = { is_premium: isPremium ? 1 : 0 };
        if (expiresAt !== null) {
            updateData.premium_expires_at = expiresAt;
        }
        const { error } = await supabaseAdmin
            .from('api_keys')
            .update(updateData)
            .eq('id', id);
        if (error) throw error;
        return { changes: 1 };
    },

    async hasPremiumKeys(userId) {
        if (!supabaseAdmin) return false;
        try {
            const now = new Date().toISOString();
            const { data, error } = await supabaseAdmin
                .from('api_keys')
                .select('premium_expires_at')
                .eq('user_id', userId)
                .eq('is_premium', 1)
                .gt('premium_expires_at', now);
            if (error) throw error;
            return (data && data.length > 0);
        } catch (err) {
            throw err;
        }
    },

    async getPremiumExpiry(userId) {
        if (!supabaseAdmin) return null;
        try {
            const { data, error } = await supabaseAdmin
                .from('api_keys')
                .select('premium_expires_at')
                .eq('user_id', userId)
                .eq('is_premium', 1)
                .or(`premium_expires_at.gt.${new Date().toISOString()},premium_expires_at.is.null`)
                .order('premium_expires_at', { ascending: false })
                .limit(1)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return data?.premium_expires_at || null;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = ApiKeyModel;