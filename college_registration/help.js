const pool = require('./db');

// Custom error carrying an HTTP status
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Wrap async handlers so thrown errors reach the error middleware
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Parse a positive integer id or throw 400
function parseId(value, label = 'id') {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${label} must be a positive integer`);
  return n;
}

// Require a non-empty string
function requireString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, `${label} is required`);
  }
  return value.trim();
}

// Optional string: returns trimmed string or null
function optionalString(value, label) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new HttpError(400, `${label} must be a string`);
  return value.trim();
}

// Make sure a row exists in table.column = id, else 404. Returns the row.
async function mustExist(table, column, id, label, conn = pool) {
  const [rows] = await conn.query(`SELECT * FROM ${table} WHERE ${column} = ?`, [id]);
  if (rows.length === 0) throw new HttpError(404, `${label} with id ${id} not found`);
  return rows[0];
}

module.exports = { HttpError, wrap, parseId, requireString, optionalString, mustExist };