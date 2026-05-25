# NutriPlan
> Personalized meal planning platform. NutriPlan helps you create a weekly meal plan based on your nutritional needs, featuring authentic Italian recipes and a modern, intuitive interface.
## Demo
**[Live Site](https://nutri-plan-iota-two.vercel.app)**
### Homepage
![Homepage](public/img/screen_homepage.png)
---
## Features
### Built-in BMI Calculator
Calculate your Body Mass Index directly from the homepage. The system analyzes weight and height to provide a comprehensive overview of your nutritional status, with personalized suggestions.
### 3-Step Diet Wizard
A guided 3-step process to create your personalized meal plan:
1. **Step 1 - Goal**: Choose between "Lose Weight" or "Build Muscle"
2. **Step 2 - Personal Data**: Enter weight, height, age, sex, and activity level
3. **Step 3 - Confirmation**: Review and confirm your personalized nutritional plan
### Advanced Nutritional Algorithms
The system uses scientifically recognized formulas:
- **BMI**: Body Mass Index
- **BMR (Mifflin-St Jeor)**: Resting energy expenditure
- **TDEE**: Total daily energy expenditure
- **Macronutrients**: Proteins, carbs, and fats calculated based on your goal
### Weekly Meal Plan
Auto-generates a complete 7-day meal plan with:
- **Breakfast**: Energy-packed meals to start the day
- **Lunch**: Balanced midday meals
- **Dinner**: Light yet nutritious meals
- **Snack**: Healthy snacks between meals
- **Weekly Cheat Meal**: A guilt-free indulgence
Each meal includes:
- Dish name
- Required ingredients
- Prep time
- Difficulty level
- Cooking instructions
- Full nutritional breakdown (calories, protein, carbs, fat)
### Authentic Italian Recipes
Over 150 pre-loaded traditional Italian recipes, organized by category:
- First courses (pasta, risotto, soups)
- Main courses (meat, fish, eggs)
- One-dish meals and salads
- Breakfasts and snacks
- Weekly cheat meals
### Food Search
Integration with Open Food Facts to look up detailed nutritional information for any food. When the API is temporarily unavailable, the system falls back to a local database.
### API Key Management
![API Keys](public/img/screen_api_keys.png)
Dedicated section for managing personal API keys, useful for:
- Programmatic access to your nutritional data
- Integration with other applications
- Public access to your diet plan (with consent)
**Free Tier**: Up to 2 API keys
**Premium**: €2/month for unlimited keys + advanced features
### User Dashboard
![Dashboard](public/img/screen_dashboard.png)
Full-featured dashboard with:
- Weekly meal plan overview
- Daily nutritional statistics
- Goal progress tracking
- One-click plan regeneration
### Multi-Format Support
API data available in:
- **JSON**: default format
- **XML**: available via `?format=xml` parameter or `Accept: application/xml` header
---
## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Frontend | EJS + Vanilla JavaScript |
| Database | Supabase (PostgreSQL) |
| Auth | JWT |
| External APIs | Open Food Facts, TheMealDB |
---
## Quick Start
```bash
git clone https://github.com/35p0101/NutriPlan.git
cd NutriPlan
npm install
```
Create a `.env` file:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_here
PORT=3000
NODE_ENV=production
PAYPAL_EMAIL=youremail@domain.com
SITE_URL=your_site_url
```
Start the server:
```bash
npm run dev
```
Open `http://localhost:3000`
---
## Public API
| Endpoint | Description |
|----------|-------------|
| `GET /api/recipes` | Random Italian recipes |
| `GET /api/food?q=food` | Search nutritional info |
| `GET /api/foods-by-goal?goal=slim\|muscle` | Recommended foods by goal |
| `GET /api/meal/:name` | Recipe details |
## API Key Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /api/meal-plan` | User's weekly meal plan |
| `GET /api/diet` | Diet data (BMI, calories, macros) |
| `POST /api/regenerate` | Regenerate meal plan |
---
## License
MIT
