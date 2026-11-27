const express = require('express');
const db = require('../db');
const router = express.Router();

// Every course query also returns the faculty member's name.
const COURSE_SELECT =
  'SELECT c.*, f.first_name AS faculty_first_name, f.last_name AS faculty_last_name ' +
  'FROM course c JOIN faculty f ON c.faculty_id = f.faculty_id';

async function findCourse(id) {
  const [rows] = await db.query(COURSE_SELECT + ' WHERE c.course_id = ?', [id]);
  return rows[0];
}

async function findFaculty(id) {
  const [rows] = await db.query('SELECT * FROM faculty WHERE faculty_id = ?', [id]);
  return rows[0];
}

// READ ALL
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(COURSE_SELECT);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL FOR ONE FACULTY MEMBER (faculty schedule)
router.get('/faculty/:facultyId', async (req, res) => {
  try {
    const faculty = await findFaculty(req.params.facultyId);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    const [rows] = await db.query(COURSE_SELECT + ' WHERE c.faculty_id = ?', [req.params.facultyId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const course = await findCourse(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const course_number = (req.body.course_number || '').trim();
    const course_name = (req.body.course_name || '').trim() || null;
    const enrollment_limit = req.body.enrollment_limit || null;
    const faculty_id = req.body.faculty_id || null;
    if (!course_number) {
      return res.status(400).json({ error: 'course_number is required' });
    }
    if (!(await findFaculty(faculty_id))) {
      return res.status(400).json({ error: 'faculty_id must be an existing faculty member' });
    }
    const [result] = await db.query(
      'INSERT INTO course (course_number, course_name, faculty_id, enrollment_limit) VALUES (?, ?, ?, ?)',
      [course_number, course_name, faculty_id, enrollment_limit]
    );
    res.status(201).json({ course_id: result.insertId, course_number, course_name, faculty_id, enrollment_limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const course = await findCourse(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const course_number = (req.body.course_number || '').trim();
    const course_name = (req.body.course_name || '').trim() || null;
    const enrollment_limit = req.body.enrollment_limit || null;
    const faculty_id = req.body.faculty_id || null;
    if (!course_number) {
      return res.status(400).json({ error: 'course_number is required' });
    }
    if (!(await findFaculty(faculty_id))) {
      return res.status(400).json({ error: 'faculty_id must be an existing faculty member' });
    }
    await db.query(
      'UPDATE course SET course_number = ?, course_name = ?, faculty_id = ?, enrollment_limit = ? WHERE course_id = ?',
      [course_number, course_name, faculty_id, enrollment_limit, req.params.id]
    );
    res.json({ course_id: course.course_id, course_number, course_name, faculty_id, enrollment_limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const course = await findCourse(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    await db.query('DELETE FROM course WHERE course_id = ?', [req.params.id]);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
