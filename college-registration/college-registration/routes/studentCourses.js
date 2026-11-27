const express = require('express');
const pool = require('../db');
const { HttpError, wrap, parseId, mustExist } = require('../helpers');

const router = express.Router();

// Look up one registration row (shared shape)
async function getRegistration(id) {
  const [rows] = await pool.query(
    'SELECT id, student_id AS studentId, course_id AS courseId FROM student_course WHERE id = ?',
    [id]
  );
  return rows[0];
}

// Validate student + course, uniqueness, and capacity. excludeId is the row being updated.
async function validateRegistration(conn, studentId, courseId, excludeId = null) {
  await mustExist('student', 'student_id', studentId, 'Student', conn);
  const course = await mustExist('course', 'course_id', courseId, 'Course', conn);

  const [dup] = await conn.query(
    'SELECT id FROM student_course WHERE student_id = ? AND course_id = ? AND id <> ?',
    [studentId, courseId, excludeId || 0]
  );
  if (dup.length > 0) throw new HttpError(409, 'Student is already registered for this course');

  if (course.enrollment_limit !== null) {
    const [cnt] = await conn.query(
      'SELECT COUNT(*) AS n FROM student_course WHERE course_id = ? AND id <> ?',
      [courseId, excludeId || 0]
    );
    if (cnt[0].n >= course.enrollment_limit) {
      throw new HttpError(409, `Course is full (enrollment limit ${course.enrollment_limit})`);
    }
  }
}

// READ ALL
router.get('/', wrap(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, student_id AS studentId, course_id AS courseId FROM student_course ORDER BY id'
  );
  res.json(rows);
}));

// CLASS ROSTER: students in a course + faculty name
router.get('/course/:courseId', wrap(async (req, res) => {
  const courseId = parseId(req.params.courseId, 'course id');
  await mustExist('course', 'course_id', courseId, 'Course');
  const [rows] = await pool.query(
    `SELECT sc.id, sc.course_id AS courseId, c.course_number AS courseNumber, c.course_name AS courseName,
            s.student_id AS studentId, s.first_name AS studentFirstName, s.last_name AS studentLastName,
            f.first_name AS facultyFirstName, f.last_name AS facultyLastName
     FROM student_course sc
     JOIN student s ON s.student_id = sc.student_id
     JOIN course c  ON c.course_id  = sc.course_id
     JOIN faculty f ON f.faculty_id = c.faculty_id
     WHERE sc.course_id = ?
     ORDER BY s.last_name, s.first_name`,
    [courseId]
  );
  res.json(rows);
}));

// STUDENT SCHEDULE: courses for a student + faculty name
router.get('/student/:studentId', wrap(async (req, res) => {
  const studentId = parseId(req.params.studentId, 'student id');
  await mustExist('student', 'student_id', studentId, 'Student');
  const [rows] = await pool.query(
    `SELECT sc.id, sc.student_id AS studentId, c.course_id AS courseId,
            c.course_number AS courseNumber, c.course_name AS courseName,
            f.first_name AS facultyFirstName, f.last_name AS facultyLastName
     FROM student_course sc
     JOIN course c  ON c.course_id  = sc.course_id
     JOIN faculty f ON f.faculty_id = c.faculty_id
     WHERE sc.student_id = ?
     ORDER BY c.course_number`,
    [studentId]
  );
  res.json(rows);
}));

// READ ONE
router.get('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'registration id');
  await mustExist('student_course', 'id', id, 'Registration');
  res.json(await getRegistration(id));
}));

// CREATE (transaction + row lock on the course so the limit can't be raced past)
router.post('/', wrap(async (req, res) => {
  const studentId = parseId(req.body.studentId, 'studentId');
  const courseId = parseId(req.body.courseId, 'courseId');
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('SELECT course_id FROM course WHERE course_id = ? FOR UPDATE', [courseId]);
    await validateRegistration(conn, studentId, courseId);
    const [result] = await conn.query(
      'INSERT INTO student_course (student_id, course_id) VALUES (?, ?)',
      [studentId, courseId]
    );
    await conn.commit();
    res.status(201).json({ id: result.insertId, studentId, courseId });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}));

// UPDATE
router.put('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'registration id');
  const studentId = parseId(req.body.studentId, 'studentId');
  const courseId = parseId(req.body.courseId, 'courseId');
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await mustExist('student_course', 'id', id, 'Registration', conn);
    await conn.query('SELECT course_id FROM course WHERE course_id = ? FOR UPDATE', [courseId]);
    await validateRegistration(conn, studentId, courseId, id);
    await conn.query('UPDATE student_course SET student_id = ?, course_id = ? WHERE id = ?', [studentId, courseId, id]);
    await conn.commit();
    res.json({ id, studentId, courseId });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}));

// DELETE
router.delete('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'registration id');
  await mustExist('student_course', 'id', id, 'Registration');
  await pool.query('DELETE FROM student_course WHERE id = ?', [id]);
  res.json({ message: `Registration ${id} deleted` });
}));

module.exports = router;
