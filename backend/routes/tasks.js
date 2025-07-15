const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { body, validationResult } = require('express-validator');
const path = require('path');

const router = express.Router();

// Database connection
const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database with schema
const initDb = () => {
  const fs = require('fs');
  const schemaPath = path.join(__dirname, '../db/init.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schema, (err) => {
    if (err) {
      console.error('Error initializing database:', err);
    } else {
      console.log('Database initialized successfully');
    }
  });
};

// Initialize database on startup
initDb();

// Validation middleware
const validateTask = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in-progress, completed, cancelled'),
  body('due_date')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true; // Allow empty values
      }
      // Check if it's a valid ISO 8601 date
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .withMessage('Due date must be a valid ISO 8601 date')
];

// Helper function to run SQL queries with promises
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Helper function to run SQL commands with promises
const runCommand = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// GET /api/tasks - Get all tasks with optional filtering
router.get('/', async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM tasks';
    let params = [];
    let conditions = [];

    // Add status filter
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    // Add search filter
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    // Add conditions to SQL
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Add ordering
    sql += ' ORDER BY created_at DESC';

    const tasks = await runQuery(sql, params);
    
    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id - Get a specific task
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid task ID is required'
      });
    }

    const tasks = await runQuery('SELECT * FROM tasks WHERE id = ?', [id]);
    
    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: tasks[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks - Create a new task
router.post('/', validateTask, async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, description, status = 'pending', due_date } = req.body;
    
    const sql = `
      INSERT INTO tasks (title, description, status, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `;
    
    const result = await runCommand(sql, [title, description, status, due_date]);
    
    // Get the created task
    const tasks = await runQuery('SELECT * FROM tasks WHERE id = ?', [result.id]);
    
    res.status(201).json({
      success: true,
      data: tasks[0],
      message: 'Task created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', validateTask, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid task ID is required'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Check if task exists
    const existingTasks = await runQuery('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existingTasks.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    const { title, description, status, due_date } = req.body;
    
    const sql = `
      UPDATE tasks 
      SET title = ?, description = ?, status = ?, due_date = ?, updated_at = datetime('now')
      WHERE id = ?
    `;
    
    await runCommand(sql, [title, description, status, due_date, id]);
    
    // Get the updated task
    const tasks = await runQuery('SELECT * FROM tasks WHERE id = ?', [id]);
    
    res.json({
      success: true,
      data: tasks[0],
      message: 'Task updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid task ID is required'
      });
    }

    // Check if task exists
    const existingTasks = await runQuery('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existingTasks.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    await runCommand('DELETE FROM tasks WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tasks/:id/status - Update task status only
router.patch('/:id/status', [
  body('status')
    .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in-progress, completed, cancelled')
], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid task ID is required'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Check if task exists
    const existingTasks = await runQuery('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existingTasks.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    await runCommand(
      'UPDATE tasks SET status = ?, updated_at = datetime("now") WHERE id = ?',
      [status, id]
    );
    
    // Get the updated task
    const tasks = await runQuery('SELECT * FROM tasks WHERE id = ?', [id]);
    
    res.json({
      success: true,
      data: tasks[0],
      message: 'Task status updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
