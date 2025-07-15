# Task Management System

A full-stack task management application built with React (Frontend) and Node.js/Express (Backend) with SQLite database.

## 🚀 Features

- **Create, Read, Update, Delete (CRUD)** operations for tasks
- **Task Status Management**: Pending, In Progress, Completed, Cancelled
- **Due Date Tracking**: Optional due dates with validation
- **Search and Filter**: Filter tasks by status and search by title/description
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Validation**: Form validation with error messages
- **RESTful API**: Clean API endpoints for all operations

## 🏗️ Project Structure

```
task-crud/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state management
│   │   └── ...
│   └── package.json
├── backend/           # Node.js/Express API
│   ├── routes/        # API route handlers
│   ├── db/           # Database schema and initialization
│   ├── middleware/   # Express middleware
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-crud-project
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Start the Development Servers

#### Backend (Terminal 1)
```bash
cd backend
npm start
```
The backend will run on `http://localhost:3001`

#### Frontend (Terminal 2)
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### 4. Access the Application
Open your browser and navigate to `http://localhost:3000`

## 📚 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (with optional filtering)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/status` - Update task status

### Query Parameters
- `status` - Filter by task status
- `search` - Search in title and description

## 🗄️ Database Schema

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    due_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## 🎨 UI Components

### Form Validation
- **Title**: Required field (max 255 characters)
- **Description**: Optional field (max 1000 characters)
- **Status**: Optional (defaults to 'pending')
- **Due Date**: Optional (must be valid date if provided)

### Visual Indicators
- **Red asterisk (*)**: Required fields
- **Gray "(optional)"**: Optional fields
- **Error messages**: Real-time validation feedback

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=3001
NODE_ENV=development
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 📝 Available Scripts

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Backend
```bash
npm start          # Start development server
npm run dev        # Start with nodemon (if configured)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue in the repository. 
