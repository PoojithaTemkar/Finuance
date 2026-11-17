# 💰 Finuance – Personal Finance Management & Analytics Platform

Finuance is a full-stack personal finance management application designed to help users track their income and expenses, manage budgets, analyse spending patterns, and gain meaningful insights into their financial activities.

The platform combines transaction management, budget monitoring, and data analytics to provide a clearer understanding of personal finances and support better financial decisions through personalized insights and budget recommendations.

## ✨ Features

### 1. Transaction Management
- Add, edit, view, and delete financial transactions.
- Track both income and expenses.
- Organize transactions using categories.
- Maintain a structured record of financial activities.

### 2. Budget Management
- Create and manage monthly budgets.
- Monitor spending against allocated budgets.
- Compare planned budgets with actual expenses.
- Track budget utilization.

### 3. Financial Dashboard
- Get an overview of income, expenses, and savings.
- Monitor important financial information in one place.
- View recent financial transactions.

### 4. Spending Analytics
- Analyse category-wise spending patterns.
- Visualize monthly income and expenses.
- Understand spending behaviour through data visualizations.
- Compare budget allocations with actual spending.

### 5. Financial Insights & Recommendations
- Analyse financial activities to identify spending patterns.
- Generate personalized financial insights.
- Provide budget recommendations based on spending behaviour.

### 6. Additional Modules
- **Categories:** Organize and manage transaction categories.
- **Financial Goals:** Manage personal financial goals.
- **Alerts:** View important financial updates and notifications.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Data Analytics | Python, Pandas |
| Data Visualization | Power BI |
| API Communication | REST APIs |
| Development Tools | Git, GitHub, VS Code |

## 🏗️ System Architecture

Finuance follows a client-server architecture with PostgreSQL as its primary database.

```text
       React.js Frontend
              |
              | REST API Requests
              |
       Node.js + Express.js
              |
              | Database Queries
              |
          PostgreSQL
```

The frontend communicates with the backend through REST APIs. The Express server handles application logic and database operations, while PostgreSQL stores the financial data.

Python and Pandas support the data analytics workflow, with Power BI used for data visualization and analytical reporting.

## 📁 Project Structure

```text
Finuance/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── transactionRoutes.js
│   │
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/PoojithaTemkar/Finuance.git
```

Navigate into the project directory:

```bash
cd Finuance
```

### 2. Configure the Database

Create a PostgreSQL database named:

```sql
CREATE DATABASE finuance;
```

The backend expects a PostgreSQL schema compatible with its database queries.

**Note:** Database migrations and seed scripts are not currently included in this repository. Configure the required database tables and relationships before starting the backend.

### 3. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm ci
```

Create a `.env` file inside the `backend/` directory with the following configuration:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=finuance
DB_USER=postgres
DB_PASSWORD=your-local-password
```

Replace the database credentials with your local PostgreSQL configuration.

Start the backend development server:

```bash
npm run dev
```

Alternatively, run without Node.js watch mode:

```bash
npm start
```

The backend API will be available at:

```text
http://localhost:5000
```

Check the API and database connectivity:

```text
http://localhost:5000/api/health
```

### 4. Configure the Frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm ci
```

Start the frontend development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

The frontend uses the following default API base URL:

```text
http://localhost:5000/api
```

To configure a different API URL, create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 5. Build & Lint

To create a production build:

```bash
npm run build
```

To check frontend code quality:

```bash
npm run lint
```

Run these commands from the `frontend/` directory.

## 🔗 API Endpoints

The Express backend provides REST APIs for the following operations:

| Endpoint | Description |
|---|---|
| `GET /api/health` | Check API and PostgreSQL connectivity |
| `/api/transactions` | Manage financial transactions |
| `/api/categories` | Manage transaction categories |
| `/api/budgets` | Manage budgets |
| `GET /api/analytics/summary` | Retrieve income, expenses, and savings summary |
| `GET /api/analytics/category-spending` | Retrieve category-wise spending |
| `GET /api/analytics/monthly` | Retrieve monthly income and expenses |
| `GET /api/analytics/budget-performance` | Compare budget and actual spending |
| `GET /api/analytics/recent-transactions` | Retrieve recent transactions |

The transaction, category, and budget endpoints support their respective CRUD operations (Create, Read, Update, and Delete).

Refer to the route files inside `backend/routes/` for request parameters and response structures.

## 🔒 Environment & Security

- Database credentials are stored in environment variables.
- `.env` files are excluded from version control.
- The repository includes `backend/.env.example` as a configuration reference.
- The current API does not implement authentication or authorization.
- Do not expose the API publicly with real financial data without implementing appropriate security controls.

## 🚀 Future Enhancements

Potential improvements to extend the platform include:

- Automated receipt scanning and transaction extraction.
- Advanced spending behaviour analysis.
- More personalized financial recommendations.
- Enhanced
