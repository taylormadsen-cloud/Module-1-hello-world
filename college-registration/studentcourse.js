const express = require('express');
const db = require('../db');
const router = express.Router();

// Every query returns the student's name, the course, and the faculty member's name.
const DETAIL_SELECT =
  'SELECT sc.id, sc.student_id, sc.course_id, ' +
  's.first_name AS student_first_name, s.last_name AS student_last_name, ' +
  'c.course_number, c.course_name, ' +
  'f.first_name AS faculty_first_name, f.last_name AS faculty_last_name ' +
  'FROM student_course sc ' +
  'JOIN student s ON sc.student_id = s.student_id ' +
  'JOIN course c ON sc.course_id = c.course_id ' +
  'JOIN faculty f ON c.faculty_id = f.faculty_id';

async function findRegistration(id) {
  const [rows] = await db.query(DETAIL_SELECT + ' WHERE sc.id = ?', [id]);
  return rows[0];
}

// Checks used by both POST and PUT. Returns { status, error } if something is wrong,
// or null if the registration is fine. ignoreId is the registration being updated,
// so it doesn't count against itself (use 0 when adding a new one).
async function checkRegistration(student_id, course_id, ignoreId) {
  const [students] = await db.query('SELECT * FROM student WHERE student_id = ?', [student_id]);
  if (students.length === 0) {
    return { status: 400, error: 'student_id must be an existing student' };
  }

  const [courses] = await db.query('SELECT * FROM course WHERE course_id = ?', [course_id]);
  if (courses.length === 0) {
    return { status: 400, error: 'course_id must be an existing course' };
  }

  // a student can be registered for a course only once
  const [same] = await db.query(
    'SELECT id FROM student_course WHERE student_id = ? AND course_id = ? AND id <> ?',
    [student_id, course_id, ignoreId]
  );
  if (same.length > 0) {
    return { status: 409, error: 'This student is already registered for this course' };
  }

  // the course can't go over its enrollment limit
  const limit = courses[0].enrollment_limit;
  if (limit !== null) {
    const [enrolled] = await db.query(
      'SELECT id FROM student_course WHERE course_id = ? AND id <> ?',
      [course_id, ignoreId]
    );
    if (enrolled.length >= limit) {
      return { status: 409, error: 'Course is full (enrollment limit is ' + limit + ')' };
    }
  }

  return null;
}

// READ ALL
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(DETAIL_SELECT);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL FOR ONE COURSE (class roster)
router.get('/course/:courseId', async (req, res) => {
  try {
    const [courses] = await db.query('SELECT * FROM course WHERE course_id = ?', [req.params.courseId]);
    if (courses.length === 0) return res.status(404).json({ error: 'Course not found' });
    const [rows] = await db.query(DETAIL_SELECT + ' WHERE sc.course_id = ?', [req.params.courseId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL FOR ONE STUDENT (student schedule)
router.get('/student/:studentId', async (req, res) => {
  try {