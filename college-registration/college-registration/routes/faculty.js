const express = require('express');
const pool = require('../db');
const { HttpError, wrap, parseId, requireString, optionalString, mustExist } = require('../helpers');

const router = express.Router();

// READ ALL
router.get('/', wrap(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT faculty_id AS facultyId, last_name AS lastName, first_name AS firstName, email FROM faculty'
  );
  res.json(rows);
}));

// READ ONE
router.get('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'faculty id');
  await mustExist('faculty', 'faculty_id', id, 'Faculty');
  const [rows] = await pool.query(
    'SELECT faculty_id AS facultyId, last_name AS lastName, first_name AS firstName, email FROM faculty WHERE faculty_id = ?',
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
    'INSERT INTO faculty (last_name, first_name, email) VALUES (?, ?, ?)',
    [lastName, firstName, email]
  );
  res.status(201).json({ facultyId: result.insertId, lastName, firstName, email });
}));

// UPDATE
router.put('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'faculty id');
  await mustExist('faculty', 'faculty_id', id, 'Faculty');
  const lastName = requireString(req.body.lastName, 'lastName');
  const firstName = requireString(req.body.firstName, 'firstName');
  const email = optionalString(req.body.email, 'email');
  await pool.query(
    'UPDATE faculty SET last_name = ?, first_name = ?, email = ? WHERE faculty_id = ?',
    [lastName, firstName, email, id]
  );
  res.json({ facultyId: id, lastName, firstName, email });
}));

// DELETE (blocked if assigned to any course)
router.delete('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id, 'faculty id');
  await mustExist('faculty', 'faculty_id', id, 'Faculty');
  const [assigned] = await pool.query('SELECT COUNT(*) AS n FROM course WHERE faculty_id = ?', [id]);
  if (assigned[0].n > 0) {
    throw new HttpError(409, 'Cannot delete faculty: faculty is assigned to one or more courses');
  }
  await pool.query('DELETE FROM faculty WHERE faculty_id = ?', [id]);
  res.json({ message: `Faculty ${id} deleted` });
}));

module.exports = router;
