require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'College Registration API running' }));

app.use('/students', require('./routes/students'));
app.use('/faculty', require('./routes/faculty'));
app.use('/courses', require('./routes/courses'));
app.use('/student-courses', require('./routes/studentCourses'));

// 404 for unknown routes
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Central error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

module.exports = app;
