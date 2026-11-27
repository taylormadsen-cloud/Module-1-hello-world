# College Registration API (CMP 335 Capstone)

Express + MySQL REST API with four services: Students, Faculty, Courses, Student-Courses.

## Setup

1. Install Node.js and MySQL. Then in this folder:
   ```
   npm install
   cp .env.example .env      # then edit .env with your MySQL password
   mysql -u root -p < schema.sql
   npm start
   ```
2. Server runs at http://localhost:3000. Use Postman as the UI.

## Endpoints

Send JSON bodies (Postman: Body > raw > JSON).

### Students  `/students`
| Method | Path | Body |
|---|---|---|
| GET | /students | |
| GET | /students/:id | |
| POST | /students | `{"lastName":"Doe","firstName":"Jane","email":"jane@x.edu"}` (email optional) |
| PUT | /students/:id | same as POST |
| DELETE | /students/:id | blocked (409) if registered for a course |

### Faculty  `/faculty`
| Method | Path | Body |
|---|---|---|
| GET | /faculty | |
| GET | /faculty/:id | |
| POST | /faculty | `{"lastName":"Hopper","firstName":"Grace","email":"g@x.edu"}` |
| PUT | /faculty/:id | same as POST |
| DELETE | /faculty/:id | blocked (409) if assigned to a course |

### Courses  `/courses`
| Method | Path | Body |
|---|---|---|
| GET | /courses | |
| GET | /courses/faculty/:facultyId | faculty schedule (includes faculty name) |
| GET | /courses/:id | |
| POST | /courses | `{"courseNumber":"CMP335","courseName":"Web Dev","facultyId":2,"enrollmentLimit":30}` |
| PUT | /courses/:id | same as POST |
| DELETE | /courses/:id | blocked (409) if students enrolled |

### Student-Courses  `/student-courses`
| Method | Path | Body |
|---|---|---|
| GET | /student-courses | |
| GET | /student-courses/course/:courseId | class roster (student names + faculty name) |
| GET | /student-courses/student/:studentId | student schedule (course number, name, faculty name) |
| GET | /student-courses/:id | |
| POST | /student-courses | `{"studentId":1,"courseId":1}` |
| PUT | /student-courses/:id | same as POST |
| DELETE | /student-courses/:id | |

Errors: 400 bad input, 404 id not found, 409 rule violation (duplicate registration, course full, delete blocked).

## Demo video script (Postman)

Using the sample data in schema.sql (course 1 has limit 2):
1. GET /students, GET /students/1, POST a student, PUT it, DELETE it.
2. Same five calls for /faculty.
3. GET /students/999 -> 404 (id validation).
4. GET /courses, GET /courses/faculty/1, POST/PUT a course, POST with facultyId 999 -> 404.
5. DELETE /faculty/1 -> 409 (assigned to a course).
6. POST /student-courses {1,1}, {2,1} -> 201; repeat {1,1} -> 409 duplicate; add a third student to course 1 -> 409 full.
7. GET /student-courses/course/1 (roster) and /student-courses/student/1 (schedule).
8. DELETE /students/1 and DELETE /courses/1 -> 409 (enrolled); DELETE the registration, then retry.

## Git

```
git init
git add .
git commit -m "College registration API"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
`.env` is git-ignored; commit `.env.example` only.

## Canvas submission

Submit the video plus your files (zip this folder without node_modules).
