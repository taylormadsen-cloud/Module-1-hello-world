require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use('/students', require('./routes/students'));
app.use('/faculty', require('./routes/faculty'));
app.use('/courses', require('./routes/courses'));
app.use('/student-courses', require('./routes/studentCourses'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running at http://localhost:' + PORT));
