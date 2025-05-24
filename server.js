const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed INTEGER DEFAULT 0 CHECK(completed IN (0, 1))
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                console.log('Tasks table created or already exists.');
            }
        });
    }
});

// Basic route for testing server is running
app.get('/', (req, res) => {
    res.send('Backend server for To-Do List is running!');
});

// --- API Endpoints for Tasks ---

// POST /api/tasks (Create Task)
app.post('/api/tasks', (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === '') { // Ensure text is not just whitespace
        return res.status(400).json({ error: 'Task text is required' });
    }
    const sql = 'INSERT INTO tasks (text, completed) VALUES (?, ?)';
    db.run(sql, [text.trim(), 0], function(err) { // Use function keyword to access this.lastID
        if (err) {
            console.error('Database error on POST /api/tasks:', err.message);
            return res.status(500).json({ error: 'Could not add task to database', details: err.message });
        }
        res.status(201).json({ id: this.lastID, text: text.trim(), completed: 0 });
    });
});

// GET /api/tasks (Read All Tasks)
app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks ORDER BY id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error on GET /api/tasks:', err.message);
            return res.status(500).json({ error: 'Could not retrieve tasks', details: err.message });
        }
        const tasks = rows.map(row => ({
            id: row.id,
            text: row.text,
            completed: !!row.completed // Convert 0/1 to false/true
        }));
        res.json(tasks);
    });
});

// PUT /api/tasks/:id (Update Task)
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;

    if (text === undefined && completed === undefined) {
        return res.status(400).json({ error: 'No fields to update provided (text or completed)' });
    }

    let fieldsToUpdate = [];
    let values = [];

    if (text !== undefined) {
        if (typeof text !== 'string' || text.trim() === '') {
            return res.status(400).json({ error: 'Task text must be a non-empty string' });
        }
        fieldsToUpdate.push('text = ?');
        values.push(text.trim());
    }
    if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
            return res.status(400).json({ error: 'Completed status must be a boolean' });
        }
        fieldsToUpdate.push('completed = ?');
        values.push(completed ? 1 : 0); // Convert boolean to 0/1
    }

    if (fieldsToUpdate.length === 0) {
        // This case should ideally be caught by the initial check, but as a safeguard:
        return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id); // Add id for the WHERE clause

    const sql = `UPDATE tasks SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    
    db.run(sql, values, function(err) {
        if (err) {
            console.error(`Database error on PUT /api/tasks/${id}:`, err.message);
            return res.status(500).json({ error: 'Could not update task', details: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found or no changes made' });
        }
        // Fetch the updated task to return it
        db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error(`Database error fetching updated task on PUT /api/tasks/${id}:`, err.message);
                return res.status(500).json({ error: 'Could not fetch updated task', details: err.message });
            }
            if (!row) { // Should not happen if previous update was successful
                return res.status(404).json({ error: 'Updated task not found after update' });
            }
            res.json({ id: row.id, text: row.text, completed: !!row.completed });
        });
    });
});

// DELETE /api/tasks/:id (Delete Task)
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.run(sql, [id], function(err) {
        if (err) {
            console.error(`Database error on DELETE /api/tasks/${id}:`, err.message);
            return res.status(500).json({ error: 'Could not delete task', details: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
        // Alternatively, for 204 No Content: res.status(204).send();
    });
});


// --- End of API Endpoints ---

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error('Error closing database on SIGINT', err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});
