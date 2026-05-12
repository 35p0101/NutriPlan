const fetch = require('node-fetch');

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const GIORNI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

const SIMPLE_ITALIAN_RECIPES = {
    colazione: [
        {
            nome: 'Yogurt e Muesli con Frutta',
            ingredienti: ['Yogurt greco', 'Muesli', 'Fragole', 'Miele', 'Noci'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Versa lo yogurt in una ciotola, aggiungi il muesli, le fragole a pezzetti, le noci tritate e un filo di miele.',
            calorie: 450,
            proteine: 18,
            carboidrati: 55,
            grassi: 18
        },
        {
            nome: 'Toast Integrale con Marmellata',
            ingredienti: ['Pane integrale', 'Marmellata', 'Burro', 'Formaggio'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Tosta le fette di pane integrale, spalma la marmellata, aggiungi una noce di burro e una fetta di formaggio.',
            calorie: 420,
            proteine: 12,
            carboidrati: 52,
            grassi: 18
        },
        {
            nome: 'Fette Biscottate e Nutella',
            ingredienti: ['Fette biscottate', 'Nutella', 'Latte', 'Banana'],
            tempo: '3 min',
            difficolta: 'Facile',
            preparazione: 'Spalma la Nutella sulle fette biscottate, aggiungi fette di banana e un bicchiere di latte.',
            calorie: 520,
            proteine: 12,
            carboidrati: 65,
            grassi: 24
        },
        {
            nome: 'Biscotti e Latte',
            ingredienti: ['Biscotti integrali', 'Latte', 'Cacao in polvere', 'Miele'],
            tempo: '2 min',
            difficolta: 'Facile',
            preparazione: 'Versa il latte in una tazza, aggiungi i biscotti, una spolverata di cacao e un cucchiaio di miele.',
            calorie: 380,
            proteine: 10,
            carboidrati: 52,
            grassi: 14
        },
        {
            nome: 'Croissant e Cappuccino',
            ingredienti: ['Croissant', 'Caffè', 'Latte', 'Cacao', 'Zucchero'],
            tempo: '10 min',
            difficolta: 'Facile',
            preparazione: 'Prepara il cappuccino con caffè e latte montato con zucchero, scalda il croissant al microonde o in forno.',
            calorie: 480,
            proteine: 12,
            carboidrati: 55,
            grassi: 24
        },
        {
            nome: 'Pancake Semplici',
            ingredienti: ['Farina', 'Uova', 'Latte', 'Lievito', 'Miele', 'Burro'],
            tempo: '15 min',
            difficolta: 'Media',
            preparazione: 'Mescola farina, uova e latte. Cuoci in una padella con una noce di burro. Servi con miele e frutta.',
            calorie: 480,
            proteine: 14,
            carboidrati: 60,
            grassi: 20
        },
        {
            nome: 'Parfait di Yogurt e Granola',
            ingredienti: ['Yogurt', 'Granola', 'Lamponi', 'Sciroppo d\'acero', 'Noci'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Alterna in un bicchiere strati di yogurt, granola e lamponi. Completa con sciroppo d\'acero e noci.',
            calorie: 460,
            proteine: 16,
            carboidrati: 58,
            grassi: 18
        },
        {
            nome: 'Pane Burro e Miele',
            ingredienti: ['Pane', 'Burro', 'Miele', 'Cannella', 'Formaggio'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Tosta il pane, spalma il burro, aggiungi il miele, una spolverata di cannella e una fetta di formaggio.',
            calorie: 420,
            proteine: 10,
            carboidrati: 45,
            grassi: 22
        },
        {
            nome: 'Brioche e Succo d\'Arancia',
            ingredienti: ['Brioche', 'Succo d\'arancia', 'Biscotti'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Scalda la brioche e servila con un bicchiere di succo d\'arancia fresco e alcuni biscotti.',
            calorie: 480,
            proteine: 8,
            carboidrati: 65,
            grassi: 20
        },
        {
            nome: 'Uova Strapazzate con Pane',
            ingredienti: ['Uova', 'Pane', 'Burro', 'Sale', 'Pepe', 'Formaggio'],
            tempo: '10 min',
            difficolta: 'Facile',
            preparazione: 'Sbatti le uova e cuocile in padella con il burro e formaggio grattugiato. Tosta il pane e servi insieme.',
            calorie: 520,
            proteine: 22,
            carboidrati: 38,
            grassi: 32
        },
        {
            nome: 'Frullato di Banana e Latte',
            ingredienti: ['Banana', 'Latte', 'Miele', 'Cacao', 'Burro d\'arachidi'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Frulla la banana con il latte, il miele, il cacao e un cucchiaio di burro d\'arachidi.',
            calorie: 420,
            proteine: 14,
            carboidrati: 55,
            grassi: 16
        },
        {
            nome: 'Muffin Integrali',
            ingredienti: ['Farina integrale', 'Uova', 'Latte', 'Miele', 'Lievito', 'Noci'],
            tempo: '25 min',
            difficolta: 'Media',
            preparazione: 'Mescola gli ingredienti secchi con quelli liquidi, aggiungi noci tritate. Versa negli stampini e cuoci a 180°C per 20 min.',
            calorie: 380,
            proteine: 10,
            carboidrati: 50,
            grassi: 14
        },
        {
            nome: 'Cereali con Latte',
            ingredienti: ['Cereali', 'Latte', 'Frutta secca', 'Miele'],
            tempo: '3 min',
            difficolta: 'Facile',
            preparazione: 'Versa i cereali in una ciotola e aggiungi il latte. Completa con frutta secca e un filo di miele.',
            calorie: 420,
            proteine: 12,
            carboidrati: 55,
            grassi: 16
        },
        {
            nome: 'Focaccia e Formaggio Spalmabile',
            ingredienti: ['Focaccia', 'Formaggio spalmabile', 'Origano', 'Pomodorini'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Taglia la focaccia a metà, spalma il formaggio, aggiungi origano e pomodorini tagliati.',
            calorie: 480,
            proteine: 14,
            carboidrati: 50,
            grassi: 24
        },
        {
            nome: 'Biscotti Secchi e Tè',
            ingredienti: ['Biscotti secchi', 'Tè', 'Miele', 'Mandorle'],
            tempo: '3 min',
            difficolta: 'Facile',
            preparazione: 'Prepara il tè con miele e accompagna con i biscotti secchi e alcune mandorle.',
            calorie: 360,
            proteine: 8,
            carboidrati: 45,
            grassi: 15
        },
        {
            nome: 'Uova strapazzate con bacon',
            ingredienti: ['Uova (3)', 'Bacon', 'Pane integrale', 'Formaggio'],
            tempo: '15 min',
            difficolta: 'Media',
            preparazione: 'Rosola il bacon in padella, aggiungi le uova e mescola. Servi con pane integrale e formaggio.',
            calorie: 520,
            proteine: 28,
            carboidrati: 25,
            grassi: 35
        },
        {
            nome: 'Omelette con carne',
            ingredienti: ['Uova (3)', 'Manzo macinato', 'Cipolla', 'Formaggio'],
            tempo: '20 min',
            difficolta: 'Media',
            preparazione: 'Cuoci il manzo con la cipolla. Versa le uova sbattute sopra e aggiungi il formaggio. Chiudi a mezzaluna.',
            calorie: 480,
            proteine: 32,
            carboidrati: 10,
            grassi: 36
        },
        {
            nome: 'Pancakes proteici',
            ingredienti: ['Farina d\'avena', 'Uova', 'Proteine in polvere', 'Latte', 'Miele'],
            tempo: '20 min',
            difficolta: 'Media',
            preparazione: 'Mescola tutti gli ingredienti. Cuoci in padella. Servi con miele e frutta.',
            calorie: 450,
            proteine: 35,
            carboidrati: 45,
            grassi: 12
        },
        {
            nome: 'Avocado toast con uova',
            ingredienti: ['Pane integrale', 'Avocado', 'Uova (2)', 'Peperoncino'],
            tempo: '10 min',
            difficolta: 'Facile',
            preparazione: 'Tosta il pane, schiaccia l\'avocado, aggiungi le uova in camicia e peperoncino.',
            calorie: 420,
            proteine: 18,
            carboidrati: 32,
            grassi: 26
        },
        {
            nome: 'Colazione proteica completa',
            ingredienti: ['Uova (3)', 'Pancetta', 'Pane', 'Avocado', 'Yogurt greco', 'Frutta'],
            tempo: '15 min',
            difficolta: 'Facile',
            preparazione: 'Prepara le uova strapazzate con pancetta. Tosta il pane con avocado. Servi con yogurt e frutta.',
            calorie: 750,
            proteine: 38,
            carboidrati: 45,
            grassi: 48
        },
        {
            nome: 'Brioche con Nutella e Nocciole',
            ingredienti: ['Brioche', 'Nutella', 'Nocciole tritate', 'Latte intero'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Riscalda la brioche, spalma Nutella generosa, aggiungi nocciole e un bicchiere di latte.',
            calorie: 680,
            proteine: 14,
            carboidrati: 70,
            grassi: 38
        },
        {
            nome: 'Pasta dolce con ricotta e miele',
            ingredienti: ['Pasta piccola', 'Ricotta', 'Miele', 'Cannella', 'Noci', 'Uvetta'],
            tempo: '15 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci la pasta, scolala, mescola con ricotta, miele, cannella, noci e uvetta.',
            calorie: 720,
            proteine: 22,
            carboidrati: 85,
            grassi: 28
        },
        {
            nome: 'Pancake ripieni con frutta',
            ingredienti: ['Pancake (3)', 'Nutella', 'Banana', 'Fragole', 'Panna montata', 'Sciroppo'],
            tempo: '15 min',
            difficolta: 'Facile',
            preparazione: 'Assembla i pancake con Nutella e banana. Guarnisci con fragole, panna e sciroppo.',
            calorie: 800,
            proteine: 16,
            carboidrati: 95,
            grassi: 35
        },
        {
            nome: 'Cornetto con affettato e formaggio',
            ingredienti: ['Cornetto', 'Prosciutto cotto', 'Mozzarella', 'Succo d\'arancia'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Apri il cornetto, inserisci prosciutto e mozzarella, riscalda leggermente.',
            calorie: 580,
            proteine: 24,
            carboidrati: 45,
            grassi: 32
        }
    ],
    pranzo: [
        {
            nome: 'Pasta al Pomodoro',
            ingredienti: ['Pasta', 'Pomodori', 'Basilico', 'Olio', 'Aglio', 'Parmigiano'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci la pasta. In una padella, soffriggi l\'aglio nell\'olio, aggiungi i pomodori e cuoci 10 min. Condisci la pasta con il sugo, il basilico e parmigiano.',
            calorie: 580,
            proteine: 18,
            carboidrati: 85,
            grassi: 16
        },
        {
            nome: 'Riso con Piselli',
            ingredienti: ['Riso', 'Piselli', 'Cipolla', 'Brodo', 'Parmigiano', 'Burro'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Soffriggi la cipolla nel burro, aggiungi il riso e tostalo. Aggiungi brodo e piselli. Cuoci fino a quando il riso è pronto. Servi con parmigiano.',
            calorie: 550,
            proteine: 18,
            carboidrati: 75,
            grassi: 18
        },
        {
            nome: 'Pasta alla Carbonara',
            ingredienti: ['Pasta', 'Guanciale', 'Uova', 'Pecorino', 'Pepe nero', 'Panna'],
            tempo: '25 min',
            difficolta: 'Media',
            preparazione: 'Cuoci la pasta. In una padella, rosola il guanciale. Mescola uova, pecorino e panna, versa sulla pasta calda e aggiungi il guanciale.',
            calorie: 720,
            proteine: 28,
            carboidrati: 70,
            grassi: 38
        },
        {
            nome: 'Insalata di Riso',
            ingredienti: ['Riso', 'Pomodori', 'Mais', 'Tonno', 'Olive', 'Maionese', 'Uova'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci il riso e lascialo raffreddare. Mescola con pomodori, mais, tonno, olive e uova sode. Condisci con maionese.',
            calorie: 560,
            proteine: 24,
            carboidrati: 65,
            grassi: 24
        },
        {
            nome: 'Pasta con Pesto',
            ingredienti: ['Pasta', 'Pesto genovese', 'Pomodori cherry', 'Pinoli', 'Parmigiano'],
            tempo: '15 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci la pasta. Mescola il pesto con un mestolo di acqua di cottura e parmigiano. Condisci la pasta e aggiungi pomodori e pinoli.',
            calorie: 620,
            proteine: 20,
            carboidrati: 72,
            grassi: 28
        },
        {
            nome: 'Ravioli al Burro e Salvia',
            ingredienti: ['Ravioli', 'Burro', 'Salvia', 'Parmigiano', 'Panna'],
            tempo: '15 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci i ravioli. In una padella, sciogli il burro con la salvia e la panna. Condisci i ravioli e aggiungi parmigiano.',
            calorie: 650,
            proteine: 22,
            carboidrati: 68,
            grassi: 32
        },
        {
            nome: 'Pasta con Tonno',
            ingredienti: ['Pasta', 'Tonno in scatola', 'Pomodori', 'Olio', 'Prezzemolo', 'Capperi'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci la pasta. In una padella, salta il tonno con i pomodori, capperi e prezzemolo. Condisci la pasta con olio extravergine.',
            calorie: 580,
            proteine: 28,
            carboidrati: 65,
            grassi: 16
        },
        {
            nome: 'Insalata di Pollo',
            ingredienti: ['Petto di pollo', 'Insalata mista', 'Pomodori', 'Cetrioli', 'Maionese'],
            tempo: '30 min',
            difficolta: 'Facile',
            preparazione: 'Griglia il pollo e taglialo a strisce. Mescola con l\'insalata, pomodori e cetrioli. Condisci con maionese.',
            calorie: 380,
            proteine: 32,
            carboidrati: 12,
            grassi: 22
        },
        {
            nome: 'Pasta e Fagioli',
            ingredienti: ['Pasta', 'Fagioli borlotto', 'Pomodoro', 'Rosmarino', 'Aglio'],
            tempo: '30 min',
            difficolta: 'Facile',
            preparazione: 'Soffriggi aglio e rosmarino. Aggiungi i fagioli e il pomodoro. Aggiungi la pasta e cuoci insieme.',
            calorie: 460,
            proteine: 16,
            carboidrati: 70,
            grassi: 12
        },
        {
            nome: 'Risotto ai Funghi',
            ingredienti: ['Riso', 'Funghi champignon', 'Cipolla', 'Brodo', 'Parmigiano', 'Burro'],
            tempo: '30 min',
            difficolta: 'Media',
            preparazione: 'Soffriggi cipolla e funghi. Tosta il riso, aggiungi brodo gradualmente. Manteca con burro e parmigiano.',
            calorie: 480,
            proteine: 12,
            carboidrati: 65,
            grassi: 20
        },
        {
            nome: 'Pasta alla Norma',
            ingredienti: ['Pasta', 'Melanzane', 'Pomodoro', 'Ricotta salata', 'Basilico'],
            tempo: '30 min',
            difficolta: 'Media',
            preparazione: 'Friggi le melanzane. Prepara il sugo di pomodoro. Condisci la pasta con sugo, melanzane e ricotta.',
            calorie: 520,
            proteine: 14,
            carboidrati: 68,
            grassi: 22
        },
        {
            nome: 'Pasta all\'Amatriciana',
            ingredienti: ['Pasta', 'Guanciale', 'Pomodoro', 'Pecorino', 'Pepe'],
            tempo: '25 min',
            difficolta: 'Media',
            preparazione: 'Rosola il guanciale, aggiungi il pomodoro e cuoci 10 min. Condisci la pasta con pecorino e pepe.',
            calorie: 550,
            proteine: 18,
            carboidrati: 58,
            grassi: 26
        },
        {
            nome: 'Petto di Pollo alla Griglia con Verdure',
            ingredienti: ['Petto di pollo', 'Zucchine', 'Peperoni', 'Olio', 'Rosmarino'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Griglia il petto di pollo. Taglia le verdure e grigliale. Servi insieme con olio e rosmarino.',
            calorie: 380,
            proteine: 35,
            carboidrati: 15,
            grassi: 18
        },
        {
            nome: 'Pasta con Ragù',
            ingredienti: ['Pasta', 'Ragù', 'Parmigiano'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci la pasta. Riscalda il ragù. Condisci la pasta con il ragù e parmigiano.',
            calorie: 520,
            proteine: 16,
            carboidrati: 70,
            grassi: 20
        },
        {
            nome: 'Minestrone con Pasta',
            ingredienti: ['Pasta', 'Verdure miste', 'Brodo', 'Pomodoro', 'Fagioli'],
            tempo: '40 min',
            difficolta: 'Facile',
            preparazione: 'Soffriggi le verdure, aggiungi brodo e pasta. Cuoci fino a quando la pasta è cotta.',
            calorie: 380,
            proteine: 12,
            carboidrati: 60,
            grassi: 10
        },
        {
            nome: 'Pasta alla Puttanesca',
            ingredienti: ['Pasta', 'Pomodori', 'Acciughe', 'Capperi', 'Olive', 'Aglio'],
            tempo: '20 min',
            difficolta: 'Media',
            preparazione: 'Soffriggi aglio, acciughe, capperi e olive. Aggiungi i pomodori e cuoci. Condisci la pasta.',
            calorie: 460,
            proteine: 14,
            carboidrati: 58,
            grassi: 20
        },
        {
            nome: 'Orzo con Verdure',
            ingredienti: ['Orzo', 'Carote', 'Zucchine', 'Cipolla', 'Parmigiano'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci l\'orzo. Soffriggi le verdure e mescola con l\'orzo. Servi con parmigiano.',
            calorie: 400,
            proteine: 12,
            carboidrati: 62,
            grassi: 12
        },
        {
            nome: 'Pasta con Zucchine',
            ingredienti: ['Pasta', 'Zucchine', 'Aglio', 'Pomodoro', 'Basilico', 'Parmigiano'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci la pasta. In una padella, salta le zucchine con aglio e pomodoro. Condisci la pasta con parmigiano.',
            calorie: 580,
            proteine: 18,
            carboidrati: 78,
            grassi: 20
        },
        {
            nome: 'Pasta e Ceci',
            ingredienti: ['Pasta', 'Ceci', 'Pomodoro', 'Aglio', 'Rosmarino', 'Pane'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Soffriggi aglio e rosmarino, aggiungi ceci e pomodoro. Aggiungi la pasta e cuoci insieme. Servi con pane.',
            calorie: 620,
            proteine: 22,
            carboidrati: 85,
            grassi: 20
        },
        {
            nome: 'Insalata di Ceci',
            ingredienti: ['Ceci', 'Pomodori', 'Cipolla', 'Prezzemolo', 'Olio', 'Limone', 'Pane'],
            tempo: '15 min',
            difficolta: 'Facile',
            preparazione: 'Mescola i ceci con pomodori e cipolla. Condisci con olio, limone e prezzemolo. Servi con pane.',
            calorie: 480,
            proteine: 20,
            carboidrati: 55,
            grassi: 20
        },
        {
            nome: 'Petto di pollo con riso',
            ingredienti: ['Petto di pollo', 'Riso', 'Broccoli', 'Salsa di soia', 'Sesamo', 'Uova'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Griglia il pollo e taglialo a strisce. Cuoci il riso con le verdure. Aggiungi un\'uova in camicia. Servi con salsa.',
            calorie: 680,
            proteine: 48,
            carboidrati: 65,
            grassi: 22
        },
        {
            nome: 'Pasta con pollo e pomodoro',
            ingredienti: ['Pasta', 'Petto di pollo', 'Pomodoro', 'Basilico', 'Olio', 'Parmigiano'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci la pasta. In una padella, rosola il pollo con il pomodoro. Condisci la pasta con parmigiano.',
            calorie: 720,
            proteine: 45,
            carboidrati: 78,
            grassi: 26
        },
        {
            nome: 'Insalata di tonno e riso',
            ingredienti: ['Riso', 'Tonno', 'Mais', 'Pomodori', 'Insalata', 'Olio', 'Uova'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci il riso e lascialo raffreddare. Mescola con tonno, verdure, uova sode e condisci con olio.',
            calorie: 620,
            proteine: 40,
            carboidrati: 60,
            grassi: 26
        },
        {
            nome: 'Quinoa con verdure e pollo',
            ingredienti: ['Quinoa', 'Petto di pollo', 'Zucchine', 'Peperoni', 'Olio', 'Avocado'],
            tempo: '30 min',
            difficolta: 'Media',
            preparazione: 'Cuoci la quinoa. Rosola il pollo con le verdure. Mescola tutto insieme e aggiungi avocado a fette.',
            calorie: 680,
            proteine: 45,
            carboidrati: 55,
            grassi: 30
        },
        {
            nome: 'Pasta carbonara super',
            ingredienti: ['Pasta (150g)', 'Guanciale', 'Uova (3)', 'Pecorino', 'Panna', 'Pepe'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci la pasta al dente. Rosola il guanciale. Monta uova con pecorino e panna. Mescola tutto.',
            calorie: 950,
            proteine: 38,
            carboidrati: 90,
            grassi: 48
        },
        {
            nome: 'Risotto ai frutti di mare',
            ingredienti: ['Riso arborio', 'Gamberi', 'Cozze', 'Vongole', 'Pomodoro', 'Vino bianco', 'Aglio'],
            tempo: '35 min',
            difficolta: 'Media',
            preparazione: 'Tosta il riso, aggiungi vino bianco. Cucina i frutti di mare a parte. Unisci tutto con pomodoro.',
            calorie: 850,
            proteine: 42,
            carboidrati: 95,
            grassi: 28
        },
        {
            nome: 'Hamburger doppio con patatine',
            ingredienti: ['Panino brioche', 'Carne (200g)', 'Formaggio (2)', 'Bacon (2)', 'Insalata', 'Patatine fritte', 'Maionese'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Griglia la doppia carne con bacon e formaggio. Prepara il panino con insalata e maionese. Servi con patatine.',
            calorie: 1100,
            proteine: 55,
            carboidrati: 70,
            grassi: 65
        },
        {
            nome: 'Lasagna con ragù e besciamella',
            ingredienti: ['Pasta lasagna', 'Ragù (300g)', 'Besciamella', 'Mozzarella', 'Parmigiano', 'Burro'],
            tempo: '50 min',
            difficolta: 'Media',
            preparazione: 'Alterna strati di pasta, ragù, besciamella e formaggio. Cuoci in forno a 180°C per 35 min.',
            calorie: 920,
            proteine: 42,
            carboidrati: 85,
            grassi: 45
        },
        {
            nome: 'Chicken wings con salsa',
            ingredienti: ['Chicken wings', 'Salsa buffalo', 'Salsa ranch', 'Sedano', 'Carote'],
            tempo: '30 min',
            difficolta: 'Facile',
            preparazione: 'Cucina le ali in forno a 200°C per 25 min. Rivesti con salsa buffalo. Servi con verdure e ranch.',
            calorie: 780,
            proteine: 45,
            carboidrati: 25,
            grassi: 52
        }
    ],
    cena: [
        {
            nome: 'Bistecca con Patate al Forno',
            ingredienti: ['Bistecca', 'Patate', 'Rosmarino', 'Aglio', 'Olio', 'Burro'],
            tempo: '40 min',
            difficolta: 'Media',
            preparazione: 'Taglia le patate a cubetti, condisci con olio e rosmarino e cuoci in forno a 200°C per 30 min. Griglia la bistecca nel burro e servila con le patate.',
            calorie: 780,
            proteine: 52,
            carboidrati: 55,
            grassi: 42
        },
        {
            nome: 'Pollo al Forno con Limone',
            ingredienti: ['Pollo intero', 'Limone', 'Aglio', 'Rosmarino', 'Olio', 'Patate'],
            tempo: '60 min',
            difficolta: 'Media',
            preparazione: 'Marina il pollo con limone, aglio e rosmarino. Aggiungi patate intorno. Cuoci in forno a 180°C per 45 minuti.',
            calorie: 680,
            proteine: 52,
            carboidrati: 35,
            grassi: 38
        },
        {
            nome: 'Salmone al Forno con Asparagi',
            ingredienti: ['Filetto di salmone', 'Asparagi', 'Limone', 'Olio', 'Aneto', 'Patate'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Posiziona il salmone e gli asparagi su una teglia con patate. Condisci con olio, limone e aneto. Cuoci a 200°C per 20 min.',
            calorie: 620,
            proteine: 42,
            carboidrati: 30,
            grassi: 38
        },
        {
            nome: 'Hamburger con Insalata',
            ingredienti: ['Hamburger di manzo', 'Insalata', 'Pomodori', 'Cipolla', 'Pane', 'Formaggio'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Grilla l\'hamburger con formaggio sciolto. Tosta il pane. Servi l\'hamburger con insalata, pomodori e cipolla.',
            calorie: 680,
            proteine: 36,
            carboidrati: 45,
            grassi: 42
        },
        {
            nome: 'Cotoletta con Purè',
            ingredienti: ['Cotoletta', 'Patate', 'Burro', 'Latte', 'Pane', 'Piselli'],
            tempo: '35 min',
            difficolta: 'Media',
            preparazione: 'Friggi la cotoletta. Prepara il purè con patate, burro e latte. Aggiungi piselli. Servi insieme.',
            calorie: 780,
            proteine: 38,
            carboidrati: 58,
            grassi: 48
        },
        {
            nome: 'Merluzzo al Forno con Patate',
            ingredienti: ['Filetto di merluzzo', 'Patate', 'Cipolla', 'Olio', 'Prezzemolo', 'Pomodori'],
            tempo: '35 min',
            difficolta: 'Facile',
            preparazione: 'Disponi merluzzo e patate a fette in teglia con pomodori. Condisci con olio e cipolla. Cuoci a 200°C per 35 min.',
            calorie: 520,
            proteine: 38,
            carboidrati: 40,
            grassi: 24
        },
        {
            nome: 'Polpette al Sugo',
            ingredienti: ['Macinato di manzo', 'Pomodoro', 'Pane', 'Parmigiano', 'Uova', 'Pasta'],
            tempo: '40 min',
            difficolta: 'Media',
            preparazione: 'Prepara le polpette con il macinato, pane, uova e parmigiano. Cuoci nel sugo di pomodoro per 30 min. Servi con pasta.',
            calorie: 680,
            proteine: 38,
            carboidrati: 55,
            grassi: 38
        },
        {
            nome: 'Petto di Tacchino Gratinato',
            ingredienti: ['Petto di tacchino', 'Pangrattato', 'Parmigiano', 'Burro', 'Rosmarino', 'Patate'],
            tempo: '35 min',
            difficolta: 'Media',
            preparazione: 'Copri il tacchino con pangrattato, parmigiano e burro. Aggiungi patate. Gratina in forno a 200°C per 30 min.',
            calorie: 580,
            proteine: 48,
            carboidrati: 35,
            grassi: 30
        },
        {
            nome: 'Insalata di Pomodori e Mozzarella',
            ingredienti: ['Pomodori', 'Mozzarella di bufala', 'Basilico', 'Olio', 'Aceto', 'Pane'],
            tempo: '10 min',
            difficolta: 'Facile',
            preparazione: 'Taglia pomodori e mozzarella a fette. Alterna in un piatto con basilico. Condisci con olio e aceto. Servi con pane.',
            calorie: 480,
            proteine: 24,
            carboidrati: 28,
            grassi: 32
        },
        {
            nome: 'Pasta con Broccoli',
            ingredienti: ['Pasta', 'Broccoli', 'Aglio', 'Pecorino', 'Peperoncino', 'Salsiccia'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci la pasta. In una padella, soffriggi aglio e broccoli con salsiccia. Condisci la pasta con pecorino e peperoncino.',
            calorie: 680,
            proteine: 24,
            carboidrati: 70,
            grassi: 34
        },
        {
            nome: 'Petto di Pollo ai Funghi',
            ingredienti: ['Petto di pollo', 'Funghi champignon', 'Panna', 'Vino bianco', 'Timo', 'Riso'],
            tempo: '25 min',
            difficolta: 'Media',
            preparazione: 'Rosola il pollo, aggiungi i funghi e la panna. Cuci per 15 min e aggiungi il vino. Servi con riso.',
            calorie: 620,
            proteine: 45,
            carboidrati: 35,
            grassi: 34
        },
        {
            nome: 'Bocconcini di Maiale con Peperoni',
            ingredienti: ['Maiale a cubetti', 'Peperoni', 'Cipolla', 'Salsa di soia', 'Olio', 'Riso'],
            tempo: '30 min',
            difficolta: 'Media',
            preparazione: 'Rosola la carne, aggiungi peperoni e cipolla. Aggiungi la salsa di soia e cuoci per 20 min. Servi con riso.',
            calorie: 680,
            proteine: 40,
            carboidrati: 20,
            grassi: 32
        },
        {
            nome: 'Filetto di Manzo ai Ferri',
            ingredienti: ['Filetto di manzo', 'Rosmarino', 'Aglio', 'Olio', 'Pepe', 'Patate'],
            tempo: '15 min',
            difficolta: 'Media',
            preparazione: 'Marina il filetto con rosmarino e aglio. Griglia a fuoco medio-alto per 3-4 min per lato. Servi con patate al forno.',
            calorie: 580,
            proteine: 52,
            carboidrati: 35,
            grassi: 28
        },
        {
            nome: 'Seppie con Piselli',
            ingredienti: ['Seppie', 'Piselli', 'Pomodoro', 'Cipolla', 'Vino bianco', 'Pane'],
            tempo: '35 min',
            difficolta: 'Media',
            preparazione: 'Soffriggi cipolla e seppie. Aggiungi piselli, pomodoro e vino. Cuoci per 25 min. Servi con pane.',
            calorie: 520,
            proteine: 34,
            carboidrati: 40,
            grassi: 26
        },
        {
            nome: 'Calamari alla Griglia',
            ingredienti: ['Calamari', 'Limone', 'Aglio', 'Prezzemolo', 'Olio', 'Pane'],
            tempo: '15 min',
            difficolta: 'Facile',
            preparazione: 'Marina i calamari con limone, aglio e prezzemolo. Griglia per 2-3 min per lato. Servi con pane.',
            calorie: 480,
            proteine: 38,
            carboidrati: 28,
            grassi: 24
        },
        {
            nome: 'Scaloppine al Limone',
            ingredienti: ['Fettine di vitello', 'Limone', 'Burro', 'Farina', 'Prezzemolo', 'Riso'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Infarina le fettine e cuocile in padella con burro. Aggiungi il succo di limone e prezzemolo. Servi con riso.',
            calorie: 580,
            proteine: 40,
            carboidrati: 42,
            grassi: 30
        },
        {
            nome: 'Arrosto di Vitello',
            ingredienti: ['Arrosto di vitello', 'Carote', 'Cipolla', 'Rosmarino', 'Brodo', 'Patate'],
            tempo: '90 min',
            difficolta: 'Media',
            preparazione: 'Rosola l\'arrosto con le verdure e patate. Aggiungi brodo e cuoci in forno a 160°C per 1 ora.',
            calorie: 680,
            proteine: 52,
            carboidrati: 45,
            grassi: 34
        },
        {
            nome: 'Frittata di Zucchine',
            ingredienti: ['Uova', 'Zucchine', 'Cipolla', 'Parmigiano', 'Basilico', 'Pane'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Sbatti le uova con parmigiano. Aggiungi zucchine e cipolla grattugiati. Cuoci in padella con olio. Servi con pane.',
            calorie: 520,
            proteine: 26,
            carboidrati: 30,
            grassi: 34
        },
        {
            nome: 'Cordon Bleu',
            ingredienti: ['Fettine di pollo', 'Prosciutto', 'Formaggio', 'Uova', 'Pangrattato', 'Patate'],
            tempo: '30 min',
            difficolta: 'Media',
            preparazione: 'Farci il pollo con prosciutto e formaggio. Passa in uovo e pangrattato. Friggi fino a doratura. Servi con patate.',
            calorie: 720,
            proteine: 48,
            carboidrati: 40,
            grassi: 44
        },
        {
            nome: 'Involtini di Pollo',
            ingredienti: ['Fettine di pollo', 'Prosciutto', 'Formaggio', 'Salvia', 'Burro', 'Patate'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Avvolgi il pollo con prosciutto e formaggio, aggiungi la salvia. Cuoci in padella con burro.',
            calorie: 420,
            proteine: 36,
            carboidrati: 8,
            grassi: 28
        },
        {
            nome: 'Bistecca con patate e spinaci',
            ingredienti: ['Bistecca', 'Patate', 'Spinaci', 'Aglio', 'Olio'],
            tempo: '35 min',
            difficolta: 'Media',
            preparazione: 'Griglia la bistecch. Cuoci le patate al forno con aglio. Saltu gli spinaci in padella.',
            calorie: 680,
            proteine: 48,
            carboidrati: 40,
            grassi: 36
        },
        {
            nome: 'Salmone con riso e asparagi',
            ingredienti: ['Filetto di salmone', 'Riso', 'Asparagi', 'Limone', 'Olio'],
            tempo: '30 min',
            difficolta: 'Media',
            preparazione: 'Cuoci il salmone al forno con asparagi. Servi con riso e limone.',
            calorie: 580,
            proteine: 42,
            carboidrati: 45,
            grassi: 26
        },
        {
            nome: 'Petto di tacchino con patate',
            ingredienti: ['Petto di tacchino', 'Patate', 'Rosmarino', 'Aglio', 'Olio'],
            tempo: '40 min',
            difficolta: 'Media',
            preparazione: 'Cuoci il tacchino in padella. Al forno, cuoci le patate con rosmarino e aglio.',
            calorie: 520,
            proteine: 45,
            carboidrati: 35,
            grassi: 22
        },
        {
            nome: 'Hamburger di manzo con avocado',
            ingredienti: ['Hamburger di manzo', 'Avocado', 'Pomodori', 'Pane integrale', 'Cipolla'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Griglia l\'hamburger. Taglia l\'avocado e i pomodori. Composi il panino.',
            calorie: 620,
            proteine: 35,
            carboidrati: 38,
            grassi: 36
        },
        {
            nome: 'Pollo con pasta e pomodoro',
            ingredienti: ['Petto di pollo', 'Pasta', 'Pomodoro', 'Basilico', 'Parmigiano'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Griglia il pollo e taglialo a cubetti. Cuoci la pasta con il sugo. Mescola tutto.',
            calorie: 620,
            proteine: 42,
            carboidrati: 60,
            grassi: 24
        },
        {
            nome: 'Filetto di manzo con funghi',
            ingredienti: ['Filetto manzo (250g)', 'Funghi champignon', 'Panna', 'Aglio', 'Rosmarino', 'Burro'],
            tempo: '30 min',
            difficolta: 'Media',
            preparazione: 'Rosola il filetto nel burro con aglio e rosmarino. Aggiungi i funghi e la panna. Cuoci a puntino.',
            calorie: 920,
            proteine: 58,
            carboidrati: 20,
            grassi: 65
        },
        {
            nome: 'Salmone con patate e asparagi',
            ingredienti: ['Salmone (200g)', 'Patate', 'Asparagi', 'Limone', 'Olio', 'Erba cipollina'],
            tempo: '35 min',
            difficolta: 'Media',
            preparazione: 'Cuoci le patate al forno. Griglia il salmone con limone e olio. Completa con asparagi.',
            calorie: 780,
            proteine: 48,
            carboidrati: 55,
            grassi: 42
        },
        {
            nome: 'Costolette d\'agnello con rösti',
            ingredienti: ['Costolette agnello', 'Patate', 'Rosmarino', 'Aglio', 'Olio', 'Mentuccia'],
            tempo: '40 min',
            difficolta: 'Media',
            preparazione: 'Griglia le costolette. Grattugia le patate e forma i rösti. Cuoci in padella croccanti.',
            calorie: 880,
            proteine: 50,
            carboidrati: 45,
            grassi: 55
        },
        {
            nome: 'Pasta integrale con ragù ricco',
            ingredienti: ['Pasta integrale (150g)', 'Ragù (200g)', 'Parmigiano', 'Basilico', 'Olio'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci la pasta integrale, condisci con abbondante ragù, parmigiano e basilico.',
            calorie: 720,
            proteine: 32,
            carboidrati: 85,
            grassi: 28
        },
        {
            nome: 'Arrosto di maiale con contorno',
            ingredienti: ['Arrosto maiale', 'Patate', 'Cipolle', 'Mele', 'Rosmarino', 'Salsa'],
            tempo: '60 min',
            difficolta: 'Media',
            preparazione: 'Marina l\'arrosto con rosmarino e mele. Cuoci in forno con patate e cipolle. Servi con salsa.',
            calorie: 850,
            proteine: 52,
            carboidrati: 60,
            grassi: 45
        }
    ],
    spuntino: [
        {
            nome: 'Frutta Fresca',
            ingredienti: ['Mela', 'Banana', 'Arancia', 'Kiwi'],
            tempo: '2 min',
            difficolta: 'Facile',
            preparazione: 'Lava la frutta e consuma fresca. Puoi combinarne 2-3 tipi diversi.',
            calorie: 120,
            proteine: 1,
            carboidrati: 30,
            grassi: 0
        },
        {
            nome: 'Frutta Secca',
            ingredienti: ['Mandorle', 'Noci', 'Nocciole', 'Cacca'],
            tempo: '1 min',
            difficolta: 'Facile',
            preparazione: 'Mescola una manciata di frutta secca mista. Porzione consigliata: 30g.',
            calorie: 180,
            proteine: 5,
            carboidrati: 8,
            grassi: 16
        },
        {
            nome: 'Yogurt greco con miele',
            ingredienti: ['Yogurt greco', 'Miele', 'Cannella'],
            tempo: '3 min',
            difficolta: 'Facile',
            preparazione: 'Versa lo yogurt in una tazza, aggiungi un cucchiaio di miele e una spolverata di cannella.',
            calorie: 150,
            proteine: 15,
            carboidrati: 18,
            grassi: 3
        },
        {
            nome: 'Barretta proteica',
            ingredienti: ['Barretta proteica', 'Frutta secca'],
            tempo: '1 min',
            difficolta: 'Facile',
            preparazione: 'Consuma una barretta proteica con un piccolo contorno di frutta secca.',
            calorie: 200,
            proteine: 20,
            carboidrati: 25,
            grassi: 6
        },
        {
            nome: 'Toast integrale con avocado',
            ingredienti: ['Pane integrale', 'Avocado', 'Sale', 'Pepe'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Tosta il pane, schiaccia l\'avocado con sale e pepe, spalma sul toast.',
            calorie: 250,
            proteine: 6,
            carboidrati: 28,
            grassi: 14
        },
        {
            nome: 'Fette biscottate con ricotta',
            ingredienti: ['Fette biscottate', 'Ricotta', 'Miele'],
            tempo: '3 min',
            difficolta: 'Facile',
            preparazione: 'Spalma la ricotta sulle fette biscottate e aggiungi un filo di miele.',
            calorie: 220,
            proteine: 8,
            carboidrati: 32,
            grassi: 7
        },
        {
            nome: 'Verdure crude con hummus',
            ingredienti: ['Carote', 'Sedano', 'Cetrioli', 'Hummus'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Taglia le verdure a bastoncini e accompagna con l\'hummus.',
            calorie: 140,
            proteine: 5,
            carboidrati: 15,
            grassi: 7
        },
        {
            nome: 'Smoothie proteico',
            ingredienti: ['Latte', 'Proteine in polvere', 'Banana', 'Burro d\'arachidi'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Frulla tutti gli ingredienti fino a ottenere un composto omogeneo.',
            calorie: 280,
            proteine: 25,
            carboidrati: 30,
            grassi: 8
        },
        {
            nome: 'Cioccolato fondente e mandorle',
            ingredienti: ['Cioccolato fondente 85%', 'Mandorle'],
            tempo: '2 min',
            difficolta: 'Facile',
            preparazione: 'Rompi il cioccolato a pezzetti e accompagna con alcune mandorle.',
            calorie: 200,
            proteine: 4,
            carboidrati: 18,
            grassi: 14
        },
        {
            nome: 'Cottage cheese con frutti rossi',
            ingredienti: ['Cottage cheese', 'Mirtilli', 'Lamponi'],
            tempo: '3 min',
            difficolta: 'Facile',
            preparazione: 'Mescola il cottage cheese con i frutti rossi freschi.',
            calorie: 160,
            proteine: 14,
            carboidrati: 18,
            grassi: 4
        },
        {
            nome: 'Panino con petto di pollo',
            ingredienti: ['Panino integrale', 'Petto di pollo', 'Insalata', 'Maionese light'],
            tempo: '10 min',
            difficolta: 'Facile',
            preparazione: 'Griglia il petto di pollo, taglialo a fette e mettilo nel panino con insalata e maionese.',
            calorie: 380,
            proteine: 32,
            carboidrati: 35,
            grassi: 12
        },
        {
            nome: 'Uova e pane integrale',
            ingredienti: ['Uova (3)', 'Pane integrale', 'Olio d\'oliva'],
            tempo: '10 min',
            difficolta: 'Facile',
            preparazione: 'Sbatti le uova e cuocile in padella con un filo d\'olio. Servi con pane integrale toastato.',
            calorie: 420,
            proteine: 22,
            carboidrati: 30,
            grassi: 22
        },
        {
            nome: 'Riso con pollo e verdure',
            ingredienti: ['Riso', 'Petto di pollo', 'Broccoli', 'Salsa di soia'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci il riso e il pollo. In una padella, salta le verdure e aggiungi il pollo. Mescola con il riso.',
            calorie: 480,
            proteine: 38,
            carboidrati: 50,
            grassi: 12
        },
        {
            nome: 'Toast con tacchino e formaggio',
            ingredienti: ['Pane integrale', 'Fesa di tacchino', 'Formaggio svizzero', 'Pomodoro'],
            tempo: '8 min',
            difficolta: 'Facile',
            preparazione: 'Composi il toast con il tacchino, il formaggio e il pomodoro. Griglia fino a che il formaggio non si scioglie.',
            calorie: 360,
            proteine: 28,
            carboidrati: 32,
            grassi: 14
        },
        {
            nome: 'Yogurt proteico con cereali',
            ingredienti: ['Yogurt proteico', 'Cereali integrali', 'Noci', 'Miele'],
            tempo: '3 min',
            difficolta: 'Facile',
            preparazione: 'Versa lo yogurt in una ciotola, aggiungi i cereali, le noci tritate e un filo di miele.',
            calorie: 340,
            proteine: 22,
            carboidrati: 38,
            grassi: 12
        },
        {
            nome: 'Barretta proteica e frutta secca',
            ingredienti: ['Barretta proteica', 'Mandorle', 'Noci', 'Cacao'],
            tempo: '2 min',
            difficolta: 'Facile',
            preparazione: 'Mangia la barretta proteica insieme a un mix di mandorle e noci.',
            calorie: 420,
            proteine: 25,
            carboidrati: 35,
            grassi: 22
        },
        {
            nome: 'Toast con affettato e formaggio',
            ingredienti: ['Pane', 'Prosciutto cotto', 'Mozzarella', 'Burro', 'Ketchup'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Tosta il pane, aggiungi prosciutto e mozzarella, burro e ketchup.',
            calorie: 480,
            proteine: 22,
            carboidrati: 40,
            grassi: 26
        },
        {
            nome: 'Smoothie iperproteico',
            ingredienti: ['Latte', 'Whey protein', 'Banana', 'Burro d\'arachidi', 'Avena'],
            tempo: '5 min',
            difficolta: 'Facile',
            preparazione: 'Frulla latte, whey, banana, burro d\'arachidi e avena fino a ottenere un smoothie cremoso.',
            calorie: 520,
            proteine: 40,
            carboidrati: 45,
            grassi: 18
        },
        {
            nome: 'Cioccolato fondente e nocciole',
            ingredienti: ['Cioccolato fondente (100g)', 'Nocciole', 'Mandorle'],
            tempo: '2 min',
            difficolta: 'Facile',
            preparazione: 'Mangia il cioccolato fondente con un mix di nocciole e mandorle.',
            calorie: 550,
            proteine: 12,
            carboidrati: 40,
            grassi: 38
        },
        {
            nome: 'Panino con nutella',
            ingredienti: ['Panino', 'Nutella', 'Banana'],
            tempo: '3 min',
            difficolta: 'Facile',
            preparazione: 'Apri il panino, spalma Nutella generosa, aggiungi fette di banana.',
            calorie: 580,
            proteine: 10,
            carboidrati: 65,
            grassi: 30
        }
    ],
    sgarro: [
        {
            nome: 'Cornetto e Cappuccino',
            ingredienti: ['Cornetto', 'Caffè', 'Latte', 'Zucchero'],
            tempo: '10 min',
            difficolta: 'Facile',
            preparazione: 'Prendi un cornetto fresco e prepara un cappuccino con caffè e latte montato.',
            calorie: 380,
            proteine: 10,
            carboidrati: 45,
            grassi: 18
        },
        {
            nome: 'Pancake con Sciroppo',
            ingredienti: ['Pancake', 'Sciroppo d\'acero', 'Burro', 'Frutti rossi'],
            tempo: '15 min',
            difficolta: 'Facile',
            preparazione: 'Scalda i pancake, aggiungi una noce di burro e abbondante sciroppo d\'acero. Guarnisci con frutti rossi.',
            calorie: 520,
            proteine: 12,
            carboidrati: 65,
            grassi: 24
        },
        {
            nome: 'French Toast',
            ingredienti: ['Pane brioche', 'Uova', 'Latte', 'Cannella', 'Miele', 'Frutta'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Immergi le fette di brioche nel mixture di uova e latte. Friggile fino a doratura. Servi con miele e frutta.',
            calorie: 480,
            proteine: 14,
            carboidrati: 55,
            grassi: 22
        },
        {
            nome: 'Avocado Toast con Uova',
            ingredienti: ['Pane', 'Avocado', 'Uova', 'Peperoncino', 'Olio'],
            tempo: '10 min',
            difficolta: 'Facile',
            preparazione: 'Tosta il pane, schiaccia l\'avocado, aggiungi uova in camicia e peperoncino. Condisci con olio.',
            calorie: 420,
            proteine: 16,
            carboidrati: 35,
            grassi: 26
        },
        {
            nome: 'Colazione Americana',
            ingredienti: ['Uova', 'Bacon', 'Pane', 'Patatine fritte', 'Caffè'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci bacon e uova. Tosta il pane e aggiungi le patatine fritte. Servi con caffè.',
            calorie: 650,
            proteine: 28,
            carboidrati: 50,
            grassi: 38
        },
        {
            nome: 'Pizza Margherita',
            ingredienti: ['Impasto pizza', 'Pomodoro', 'Mozzarella', 'Basilico', 'Olio'],
            tempo: '25 min',
            difficolta: 'Media',
            preparazione: 'Stendi l\'impasto, aggiungi il pomodoro, la mozzarella e il basilico. Cuoci a 250°C per 12-15 min.',
            calorie: 800,
            proteine: 30,
            carboidrati: 95,
            grassi: 35
        },
        {
            nome: 'Pizza con Salumi',
            ingredienti: ['Impasto pizza', 'Pomodoro', 'Mozzarella', 'Prosciutto cotto', 'Salame', 'Würstel'],
            tempo: '25 min',
            difficolta: 'Media',
            preparazione: 'Stendi l\'impasto, aggiungi il pomodoro, mozzarella e i salumi. Cuoci a 250°C per 12-15 min.',
            calorie: 950,
            proteine: 38,
            carboidrati: 90,
            grassi: 48
        },
        {
            nome: 'Hamburger Deluxe',
            ingredienti: ['Panino brioche', 'Hamburger manzo', 'Formaggio', 'Bacon', 'Insalata', 'Pomodoro', 'Maionese'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Griglia l\'hamburger con bacon e formaggio. Tosta il panino. Aggiungi insalata, pomodoro e maionese.',
            calorie: 850,
            proteine: 42,
            carboidrati: 55,
            grassi: 52
        },
        {
            nome: 'Sushi Mix',
            ingredienti: ['Riso sushi', 'Salmone', 'Tonno', 'Avocado', 'Nori', 'Salsa soia', 'Wasabi'],
            tempo: '40 min',
            difficolta: 'Media',
            preparazione: 'Prepara il riso sushi. Forma gli involtini con salmone, tonno e avocado. Servi con salsa di soia e wasabi.',
            calorie: 650,
            proteine: 32,
            carboidrati: 75,
            grassi: 22
        },
        {
            nome: 'Kebab',
            ingredienti: ['Pane kebab', 'Carne kebab', 'Insalata', 'Pomodoro', 'Cipolla', 'Salsa tzatziki'],
            tempo: '15 min',
            difficolta: 'Facile',
            preparazione: 'Scalda il pane, aggiungi la carne kebab, le verdure e la salsa tzatziki.',
            calorie: 720,
            proteine: 35,
            carboidrati: 60,
            grassi: 38
        },
        {
            nome: 'Pasta alla Carbonara Extra',
            ingredienti: ['Pasta', 'Guanciale', 'Uova', 'Pecorino', 'Panna', 'Pepe'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Cuoci la pasta. Rosola il guanciale. Mescola uova, pecorino, panna e pepe. Condisci la pasta.',
            calorie: 850,
            proteine: 30,
            carboidrati: 80,
            grassi: 45
        },
        {
            nome: 'Pollo Fritto (KFC Style)',
            ingredienti: ['Pollo', 'Farina', 'Spezie', 'Olio', 'Patatine'],
            tempo: '30 min',
            difficolta: 'Media',
            preparazione: 'Impanizza il pollo con farina e spezie. Friggi fino a doratura. Servi con patatine.',
            calorie: 900,
            proteine: 45,
            carboidrati: 65,
            grassi: 55
        },
        {
            nome: 'Lasagna Ricca',
            ingredienti: ['Pasta lasagna', 'Ragù', 'Besciamella', 'Parmigiano', 'Mozzarella'],
            tempo: '45 min',
            difficolta: 'Media',
            preparazione: 'Alterna strati di pasta, ragù, besciamella e formaggio. Cuoci in forno a 180°C per 30 min.',
            calorie: 780,
            proteine: 35,
            carboidrati: 70,
            grassi: 40
        },
        {
            nome: 'Fish and Chips',
            ingredienti: ['Merluzzo', 'Patatine', 'Farina', 'Birra', 'Aceto'],
            tempo: '35 min',
            difficolta: 'Media',
            preparazione: 'Impanizza il merluzzo nella pastella di birra. Friggi insieme alle patatine. Servi con aceto.',
            calorie: 750,
            proteine: 38,
            carboidrati: 65,
            grassi: 42
        },
        {
            nome: 'Tacos Mexican',
            ingredienti: ['Tortillas', 'Carne macinata', 'Fagioli', 'Formaggio', 'Salsa', 'Guacamole'],
            tempo: '25 min',
            difficolta: 'Facile',
            preparazione: 'Scalda le tortillas. Riempile con carne, fagioli, formaggio, salsa e guacamole.',
            calorie: 680,
            proteine: 30,
            carboidrati: 55,
            grassi: 38
        },
        {
            nome: 'Arrosticini e Birra',
            ingredienti: ['Agnello', 'Peperoni', 'Cipolle', 'Birra'],
            tempo: '30 min',
            difficolta: 'Media',
            preparazione: 'Prepara gli arrosticini con agnello, peperoni e cipolle. Griglia e servi con birra.',
            calorie: 620,
            proteine: 38,
            carboidrati: 30,
            grassi: 38
        },
        {
            nome: 'Poke Bowl',
            ingredienti: ['Riso', 'Salmone', 'Tonno', 'Avocado', 'Edamame', 'Salsa soia', 'Sesamo'],
            tempo: '20 min',
            difficolta: 'Facile',
            preparazione: 'Metti il riso in una ciotola. Aggiungi salmone, tonno, avocado a cubetti, edamame. Condisci con salsa di soia e sesamo.',
            calorie: 580,
            proteine: 35,
            carboidrati: 55,
            grassi: 24
        }
    ]
};

async function fetchByCategory(category) {
    try {
        const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
        const data = await res.json();
        return data.meals || [];
    } catch (error) {
        console.error(`Error fetching category ${category}:`, error);
        return [];
    }
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

async function generateMealPlan(goal, calorieTarget = 2000) {
    const colazioni = shuffle([...SIMPLE_ITALIAN_RECIPES.colazione]);
    const pranzi = shuffle([...SIMPLE_ITALIAN_RECIPES.pranzo]);
    const cene = shuffle([...SIMPLE_ITALIAN_RECIPES.cena]);
    const spuntini = shuffle([...SIMPLE_ITALIAN_RECIPES.spuntino]);
    
    const sgarroColazione = [
        SIMPLE_ITALIAN_RECIPES.sgarro[0],
        SIMPLE_ITALIAN_RECIPES.sgarro[1],
        SIMPLE_ITALIAN_RECIPES.sgarro[2],
        SIMPLE_ITALIAN_RECIPES.sgarro[3],
        SIMPLE_ITALIAN_RECIPES.sgarro[4]
    ];
    const sgarroPranzoCena = SIMPLE_ITALIAN_RECIPES.sgarro.slice(5);

    const getMealsForTarget = (colazioniPool, pranziPool, cenePool, spuntiniPool, targetCal) => {
        const maxAttempts = 10000;
        const tolerance = 50;
        
        const sortedColazioni = [...colazioniPool].sort((a, b) => b.calorie - a.calorie);
        const sortedPranzi = [...pranziPool].sort((a, b) => b.calorie - a.calorie);
        const sortedCene = [...cenePool].sort((a, b) => b.calorie - a.calorie);
        
        const highCalSpuntini = spuntiniPool.filter(s => s.calorie >= 200).sort((a, b) => b.calorie - a.calorie);
        const normalSpuntini = [...spuntiniPool].sort((a, b) => b.calorie - a.calorie);

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const colazione = colazioniPool[Math.floor(Math.random() * colazioniPool.length)];
            const pranzo = pranziPool[Math.floor(Math.random() * pranziPool.length)];
            const cena = cenePool[Math.floor(Math.random() * cenePool.length)];
            
            let spuntiniSelezionati = [];
            let spuntiniCal = 0;
            let numSnacks = 2;
            
            if (targetCal >= 2800) numSnacks = 3;
            else if (targetCal < 1800) numSnacks = 1;
            
            const snackPool = targetCal >= 2500 ? 
                [...highCalSpuntini, ...normalSpuntini] : normalSpuntini;
            
            const usedSnacks = new Set();
            for (let s = 0; s < numSnacks; s++) {
                const available = snackPool.filter(sn => !usedSnacks.has(sn.nome));
                if (available.length === 0) break;
                const snack = available[Math.floor(Math.random() * available.length)];
                spuntiniSelezionati.push(snack);
                usedSnacks.add(snack.nome);
                spuntiniCal += snack.calorie;
            }

            const totalCal = colazione.calorie + pranzo.calorie + cena.calorie + spuntiniCal;
            const diff = Math.abs(totalCal - targetCal);

            if (diff <= tolerance) {
                return {
                    colazione,
                    spuntino1: spuntiniSelezionati[0] || null,
                    spuntino2: spuntiniSelezionati[1] || null,
                    spuntino3: spuntiniSelezionati[2] || null,
                    pranzo,
                    cena,
                    totalCal
                };
            }
        }
        
        let bestCombo = null;
        let bestDiff = Infinity;
        
        for (let c of sortedColazioni) {
            for (let p of sortedPranzi) {
                for (let ce of sortedCene) {
                    const baseCal = c.calorie + p.calorie + ce.calorie;
                    const remainingCal = targetCal - baseCal;
                    
                    let snacksUsed = [];
                    let snackCal = 0;
                    let numSnacks = 2;
                    if (targetCal >= 2800) numSnacks = 3;
                    else if (targetCal < 1800) numSnacks = 1;
                    
                    const sortedSnacks = (targetCal >= 2500 ? highCalSpuntini : normalSpuntini);
                    
                    if (remainingCal > 0) {
                        for (let i = 0; i < numSnacks && i < sortedSnacks.length; i++) {
                            const snack = sortedSnacks[i];
                            if (!snacksUsed.find(s => s.nome === snack.nome)) {
                                if (snackCal + snack.calorie <= remainingCal + 100) {
                                    snacksUsed.push(snack);
                                    snackCal += snack.calorie;
                                }
                            }
                        }
                    }
                    
                    const totalCal = baseCal + snackCal;
                    const diff = Math.abs(totalCal - targetCal);
                    
                    if (diff < bestDiff) {
                        bestDiff = diff;
                        bestCombo = {
                            colazione: c,
                            pranzo: p,
                            cena: ce,
                            spuntino1: snacksUsed[0] || null,
                            spuntino2: snacksUsed[1] || null,
                            spuntino3: snacksUsed[2] || null,
                            totalCal
                        };
                    }
                    
                    if (diff <= tolerance) break;
                }
                if (bestCombo && Math.abs(bestCombo.totalCal - targetCal) <= tolerance) break;
            }
            if (bestCombo && Math.abs(bestCombo.totalCal - targetCal) <= tolerance) break;
        }

        return bestCombo;
    };

    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const piano = {};

    for (let i = 0; i < GIORNI.length; i++) {
        const giorno = GIORNI[i];
        const isDomenica = i === 6;

        if (isDomenica) {
            piano[giorno] = {
                colazione: getRandomItem(sgarroColazione),
                spuntino1: null,
                pranzo: getRandomItem(sgarroPranzoCena),
                spuntino2: null,
                spuntino3: null,
                cena: getRandomItem(sgarroPranzoCena),
                isSgarro: true
            };
        } else {
            const meals = getMealsForTarget(
                colazioni, 
                pranzi, 
                cene, 
                spuntini, 
                calorieTarget
            );
            
            piano[giorno] = {
                colazione: meals.colazione,
                spuntino1: meals.spuntino1,
                pranzo: meals.pranzo,
                spuntino2: meals.spuntino2,
                spuntino3: meals.spuntino3 || null,
                cena: meals.cena,
                totalCalorie: meals.totalCal,
                isSgarro: false
            };
        }
    }

    return piano;
}

async function getMealDetail(mealName) {
    try {
        const allRecipes = [
            ...SIMPLE_ITALIAN_RECIPES.colazione,
            ...SIMPLE_ITALIAN_RECIPES.pranzo,
            ...SIMPLE_ITALIAN_RECIPES.cena,
            ...SIMPLE_ITALIAN_RECIPES.spuntino,
            ...SIMPLE_ITALIAN_RECIPES.sgarro
        ];
        return allRecipes.find(r => r.nome === mealName) || null;
    } catch (error) {
        console.error(`Error fetching meal detail for ${mealName}:`, error);
        return null;
    }
}

async function getRandomMeals(count = 6) {
    try {
        const allMeals = [
            ...SIMPLE_ITALIAN_RECIPES.colazione,
            ...SIMPLE_ITALIAN_RECIPES.pranzo,
            ...SIMPLE_ITALIAN_RECIPES.cena
        ];
        return shuffle(allMeals).slice(0, count);
    } catch (error) {
        console.error('Error fetching random meals:', error);
        return [];
    }
}

module.exports = {
    generateMealPlan,
    getMealDetail,
    getRandomMeals
};