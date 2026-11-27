const express = require('express');
const db = require('../db');
const router = express.Router();

// Look up one faculty member. Returns the row, or undefined if there is none.
async function findFaculty(id) {
  const [rows] = await db.query('SELECT * FROM faculty WHERE faculty_id = ?', [id]);
  return rows[0];
}

// READ ALL
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM faculty');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const faculty = await findFaculty(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const last_name = (req.body.last_name || '').trim();
    const first_name = (req.body.first_name || '').trim();
    const email = (req.body.email || '').trim() || null;
    if (!last_name || !first_name) {
      return res.status(400).json({ error: 'last_name and first_name are required' });
    }
    const [result] = await db.query(
      'INSERT INTO faculty (last_name, first_name, email) VALUES (?, ?, ?)',
      [last_name, first_name, email]
    );
    res.status(201).json({ faculty_id: result.insertId, last_name, first_name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const faculty = await findFaculty(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    const last_name = (req.body.last_name || '').trim();
    const first_name = (req.body.first_name || '').trim();
    const email = (req.body.email || '').trim() || null;
    if (!last_name || !first_name) {
      return res.status(400).json({ error: 'last_name and first_name are required' });
    }
    await db.query(
      'UPDATE faculty SET last_name = ?, first_name = ?, email = ? WHERE faculty_id = ?',
      [last_name, first_name, email, req.params.id]
    );
    res.json({ faculty_id: faculty.faculty_id, last_name, first_name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE (not allowed if the faculty member is assigned to a course)
router.delete('/:id', async (req, res) => {
  try {
    const faculty = await findFaculty(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const [courses] = await db.query('SELECT course_id FROM course WHERE faculty_id = ?', [req.params.id]);
    if (courses.length > 0) {
      return res.status(409).json({ error: 'Cannot delete: this faculty member is assigned to a course' });
    }

    await db.query('DELETE FROM faculty WHERE faculty_id = ?', [req.params.id]);
    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
