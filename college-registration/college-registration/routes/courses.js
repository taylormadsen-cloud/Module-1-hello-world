const express = require('express');
const pool = require('../db');
const { HttpError, wrap, parseId, requireString, optionalString, mustExist } = require('../helpers');

const router = express.Router();

const COURSE_SELECT = `
  SELECT c.course_id AS courseId, c.course_number AS courseNumber, c.course_name AS courseName,
         c.faculty_id AS facultyId, c.enrollment_limit AS enrollmentLimit,
         f.first_name AS facultyFirstName, f.last_name AS facultyLastName
  FROM course c
  JOIN faculty f ON f.faculty_id = c.faculty_id`;

// Optional non-negative integer (enrollment limit); null when omitted
function optionalLimit(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new HttpError(400, 'enrollmentLimit must be a non-negative integer');
  return n;
}

// READ ALL
router.get('/', wrap(async (req, res) => {
  const [rows] = await pool.query(`${COURSE_SELECT} ORDER BY c.course_number`);
  res.json(rows);
}));

// FACULTY SCHEDULE: all courses for a faculty id (with faculty name)
router.get('/faculty/:facultyId', wrap(async (req, res) => {
  const facultyId = parseId(req.params.facultyId, 'faculty id');
  await mustExist('faculty', 'faculty_id', facultyId, 'Faculty');
  const [rows] = await pool.query(`${COURSE_SELECT} WHERE c.faculty_id = ? ORDER BY c.course_number`, [facultyId]);
  res.json(rows);
}));

// READ ONE
router.get('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'course id');
  await mustExist('course', 'course_id', id, 'Course');
  const [rows] = await pool.query(`${COURSE_SELECT} WHERE c.course_id = ?`, [id]);
  res.json(rows[0]);
}));

// CREATE
router.post('/', wrap(async (req, res) => {
  const courseNumber = requireString(req.body.courseNumber, 'courseNumber');
  const courseName = optionalString(req.body.courseName, 'courseName');
  const facultyId = parseId(req.body.facultyId, 'facultyId');
  const enrollmentLimit = optionalLimit(req.body.enrollmentLimit);
  await mustExist('faculty', 'faculty_id', facultyId, 'Faculty');
  const [result] = await pool.query(
    'INSERT INTO course (course_number, course_name, faculty_id, enrollment_limit) VALUES (?, ?, ?, ?)',
    [courseNumber, courseName, facultyId, enrollmentLimit]
  );
  res.status(201).json({ courseId: result.insertId, courseNumber, courseName, facultyId, enrollmentLimit });
}));

// UPDATE
router.put('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'course id');
  await mustExist('course', 'course_id', id, 'Course');
  const courseNumber = requireString(req.body.courseNumber, 'courseNumber');
  const courseName = optionalString(req.body.courseName, 'courseName');
  const facultyId = parseId(req.body.facultyId, 'facultyId');
  const enrollmentLimit = optionalLimit(req.body.enrollmentLimit);
  await mustExist('faculty', 'faculty_id', facultyId, 'Faculty');
  if (enrollmentLimit !== null) {
    const [cnt] = await pool.query('SELECT COUNT(*) AS n FROM student_course WHERE course_id = ?', [id]);
    if (cnt[0].n > enrollmentLimit) {
      throw new HttpError(409, `Cannot set enrollmentLimit to ${enrollmentLimit}: ${cnt[0].n} students already enrolled`);
    }
  }
  await pool.query(
    'UPDATE course SET course_number = ?, course_name = ?, faculty_id = ?, enrollment_limit = ? WHERE course_id = ?',
    [courseNumber, courseName, facultyId, enrollmentLimit, id]
  );
  res.json({ courseId: id, courseNumber, courseName, facultyId, enrollmentLimit });
}));

// DELETE (blocked if students are enrolled)
router.delete('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'course id');
  await mustExist('course', 'course_id', id, 'Course');
  const [cnt] = await pool.query('SELECT COUNT(*) AS n FROM student_course WHERE course_id = ?', [id]);
  if (cnt[0].n > 0) {
    throw new HttpError(409, 'Cannot delete course: students are enrolled in this course');
  }
  await pool.query('DELETE FROM course WHERE course_id = ?', [id]);
  res.json({ message: `Course ${id} deleted` });
}));

module.exports = router;
