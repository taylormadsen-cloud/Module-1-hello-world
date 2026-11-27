const express = require('express');
const pool = require('../db');
const { HttpError, wrap, parseId, requireString, optionalString, mustExist } = require('../helpers');

const router = express.Router();

// READ ALL
router.get('/', wrap(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT student_id AS studentId, last_name AS lastName, first_name AS firstName, email FROM student'
  );
  res.json(rows);
}));

// READ ONE
router.get('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'student id');
  await mustExist('student', 'student_id', id, 'Student');
  const [rows] = await pool.query(
    'SELECT student_id AS studentId, last_name AS lastName, first_name AS firstName, email FROM student WHERE student_id = ?',
    [id]
  );
  res.json(rows[0]);
}));

// CREATE
router.post('/', wrap(async (req, res) => {
  const lastName = requireString(req.body.lastName, 'lastName');
  const firstName = requireString(req.body.firstName, 'firstName');
  const email = optionalString(req.body.email, 'email');
  const [result] = await pool.query(
    'INSERT INTO student (last_name, first_name, email) VALUES (?, ?, ?)',
    [lastName, firstName, email]
  );
  res.status(201).json({ studentId: result.insertId, lastName, firstName, email });
}));

// UPDATE
router.put('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'student id');
  await mustExist('student', 'student_id', id, 'Student');
  const lastName = requireString(req.body.lastName, 'lastName');
  const firstName = requireString(req.body.firstName, 'firstName');
  const email = optionalString(req.body.email, 'email');
  await pool.query(
    'UPDATE student SET last_name = ?, first_name = ?, email = ? WHERE student_id = ?',
    [lastName, firstName, email, id]
  );
  res.json({ studentId: id, lastName, firstName, email });
}));

// DELETE (blocked if enrolled in any course)
router.delete('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'student id');
  await mustExist('student', 'student_id', id, 'Student');
  const [enr] = await pool.query('SELECT COUNT(*) AS n FROM student_course WHERE student_id = ?', [id]);
  if (enr[0].n > 0) {
    throw new HttpError(409, 'Cannot delete student: student is registered for one or more courses');
  }
  await pool.query('DELETE FROM student WHERE student_id = ?', [id]);
  res.json({ message: `Student ${id} deleted` });
}));

module.exports = router;