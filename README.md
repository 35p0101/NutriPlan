# NutriPlan

Personalized meal planning with automatic recipe generation via TheMealDB API.

## Live Demo

**Live**: https://nutri-plan-35p0101s-projects.vercel.app

## Screenshots

**Homepage** - Public landing page with BMI calculator and feature overview

![Homepage](public/img/screen_homepage.png)

**Dashboard** - User dashboard with weekly meal plan grid

![Dashboard](public/img/screen_dashboard.png)

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js 4.x |
| Template Engine | EJS |
| Database | Supabase (PostgreSQL) |
| Authentication | JWT + SHA-256 hash |
| External APIs | TheMealDB, Open Food Facts |
| Styles | Custom CSS (no framework) |
| Scripts | Vanilla JavaScript |

## Quick Start

```bash
git clone https://github.com/35p0101/NutriPlan.git
cd NutriPlan
npm install
```

Create `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure (MVC)

```
nutriplan/
├── config/db.js           # Supabase client + query builder
├── models/                # Database queries
├── controllers/            # Business logic
├── routes/                # Express routes
├── middleware/            # Auth middleware
├── views/                 # EJS templates
├── services/              # External APIs & calculations
└── public/                # Static assets (CSS, JS, img)
```

## API Endpoints

### Authenticated (JWT via cookie required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meal-plan` | Current weekly meal plan |
| GET | `/api/diet` | Diet data (BMI, calories, macros) |
| POST | `/api/regenerate` | Regenerate meal plan |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Random recipes |
| GET | `/api/food?q=` | Nutritional info |
| GET | `/api/users/:id/diet` | Public diet (requires `x-api-key` header) |

### Response Format
Default JSON. For XML: `?format=xml` or `Accept: application/xml` header.

## Database Schema (Supabase PostgreSQL)

```sql
-- users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    dob TEXT NOT NULL,
    age INTEGER NOT NULL,
    sex TEXT NOT NULL CHECK(sex IN ('M', 'F')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- diets
CREATE TABLE diets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    goal TEXT CHECK(goal IN ('slim', 'muscle')),
    weight REAL,
    height REAL,
    activity_multiplier REAL,
    bmi REAL,
    target_weight REAL,
    ideal_min REAL,
    ideal_max REAL,
    calories INTEGER,
    protein_g INTEGER,
    carbs_g INTEGER,
    fat_g INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- meal_plans
CREATE TABLE meal_plans (
    id SERIAL PRIMARY KEY,
    diet_id INTEGER REFERENCES diets(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    week_start TEXT,
    plan_json TEXT,
    generated_at TIMESTAMP DEFAULT NOW()
);
```

## Nutritional Algorithms

```javascript
// BMI
bmi = weight / (height/100)²

// BMR (Mifflin-St Jeor)
bmr = (10 * weight) + (6.25 * height) - (5 * age) + (sex === 'M' ? 5 : -161)

// TDEE
tdee = bmr * activityMultiplier // 1.2 - 1.9

// Target calories
calories = goal === 'slim' ? tdee - 400 : tdee + 250

// Macros (ratio varies by goal)
protein = (calories * proteinRatio) / 4
carbs = (calories * carbsRatio) / 4
fat = (calories * fatRatio) / 9
```

## Environment Configuration

```env
# Supabase (required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# JWT (required)
JWT_SECRET=your-secret-key
```

## Main Dependencies

- `express` - web framework
- `ejs` - template engine
- `jsonwebtoken` - authentication
- `@supabase/supabase-js` - PostgreSQL client
- `dotenv` - environment variables
- `js2xmlparser` - XML output

## Views Structure

```
views/
├── partials/           # Header, Sidebar, Footer
├── diet/               # 3-step wizard
├── index.ejs           # Public homepage
├── login.ejs           # Login
├── register.ejs        # Registration
├── dashboard.ejs        # Main dashboard
├── profile.ejs         # User profile
└── tips.ejs            # Tips & recipes
```

## Protected Routes

Routes `/dashboard`, `/profile`, `/diet/*`, `/api/*` require valid JWT. The `authMiddleware` checks the `nutriplan_token` cookie and redirects to `/login` if missing or invalid.

## TheMealDB API

Used endpoints:
- `filter.php?c={category}` - meals by category
- `random.php` - random meal
- `search.php?s={name}` - meal details

Categories mapped by goal → see `services/mealDbService.js`

## Open Food Facts API

Endpoint: `https://world.openfoodfacts.org/cgi/search.pl`

Falls back to static data if API unavailable (503 or timeout).

## License

MIT