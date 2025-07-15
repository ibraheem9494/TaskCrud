import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Home from './pages/Home';
import NewTask from './pages/NewTask';
import EditTask from './pages/EditTask';
import './App.css';

function App() {
  return (
    <TaskProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation Header */}
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center h-16">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Task Manager
                </Link>
                
                <div className="flex items-center gap-4">
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Tasks
                  </Link>
                  <Link
                    to="/new"
                    className="btn-primary"
                  >
                    New Task
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<NewTask />} />
              <Route path="/edit/:id" element={<EditTask />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-gray-600">
                <p>&copy; 2025 Task Assignment System.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </TaskProvider>
  );
}

export default App; 