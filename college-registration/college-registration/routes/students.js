const express = require('express');
const db = require('../db');
const router = express.Router();

// Look up one student. Returns the row, or undefined if there is no such student.
async function findStudent(id) {
  const [rows] = await db.query('SELECT * FROM student WHERE student_id = ?', [id]);
  return rows[0];
}

// READ ALL
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM student');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const student = await findStudent(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
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
      'INSERT INTO student (last_name, first_name, email) VALUES (?, ?, ?)',
      [last_name, first_name, email]
    );
    res.status(201).json({ student_id: result.insertId, last_name, first_name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const student = await findStudent(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    const last_name = (req.body.last_name || '').trim();
    const first_name = (req.body.first_name || '').trim();
    const email = (req.body.email || '').trim() || null;
    if (!last_name || !first_name) {
      return res.status(400).json({ error: 'last_name and first_name are required' });
    }
    await db.query(
      'UPDATE student SET last_name = ?, first_name = ?, email = ? WHERE student_id = ?',
      [last_name, first_name, email, req.params.id]
    );
    res.json({ student_id: student.student_id, last_name, first_name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE (not allowed if the student is registered for a course)
router.delete('/:id', async (req, res) => {
  try {
    const student = await findStudent(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const [registered] = await db.query('SELECT id FROM student_course WHERE student_id = ?', [req.params.id]);
    if (registered.length > 0) {
      return res.status(409).json({ error: 'Cannot delete: this student is registered for a course' });
    }

    await db.query('DELETE FROM student WHERE student_id = ?', [req.params.id]);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
