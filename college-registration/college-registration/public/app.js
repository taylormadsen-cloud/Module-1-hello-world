// ---------- helpers ----------

// Send a request to the server and return the JSON it sends back.
// If the server answers with an error, throw an Error with the server's message.
async function api(method, url, body) {
  const options = { method: method, headers: {} };
  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Make text safe to put inside HTML
function esc(text) {
  const div = document.createElement('div');
  div.textContent = (text === null || text === undefined) ? '' : text;
  return div.innerHTML;
}

// type is: success, danger or warning
function showMessage(text, type) {
  document.getElementById('message').innerHTML =
    '<div class="alert alert-' + type + '">' + esc(text) + '</div>';
}

function clearMessage() {
  document.getElementById('message').innerHTML = '';
}

// Fill a dropdown with options (keeps whatever was selected).
// items: the list, idKey: which field is the value, labelFunction: how to show each one
function fillSelect(selectId, items, idKey, labelFunction) {
  const select = document.getElementById(selectId);
  const keep = select.value;
  let options = '<option value="">Select...</option>';
  for (const item of items) {
    options += '<option value="' + item[idKey] + '">' + esc(labelFunction(item)) + '</option>';
  }
  select.innerHTML = options;
  select.value = keep;
}

// ---------- STUDENTS ----------

async function loadStudents() {
  try {
    const students = await api('GET', '/students');
    let rows = '';
    for (const s of students) {
      rows += '<tr><td>' + s.student_id + '</td><td>' + esc(s.last_name) + '</td><td>' +
        esc(s.first_name) + '</td><td>' + esc(s.email) + '</td><td>' +
        '<button class="btn btn-sm btn-outline-secondary" onclick="editStudent(' + s.student_id + ')">Edit</button> ' +
        '<button class="btn btn-sm btn-outline-danger" onclick="deleteStudent(' + s.student_id + ')">Delete</button>' +
        '</td></tr>';
    }
    document.getElementById('students-table').innerHTML = rows;
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

// POST a new student, or PUT if the hidden id field is filled (we are editing)
async function saveStudent(event) {
  event.preventDefault();
  const id = document.getElementById('student-id').value;
  const student = {
    last_name: document.getElementById('student-last').value.trim(),
    first_name: document.getElementById('student-first').value.trim(),
    email: document.getElementById('student-email').value.trim()
  };
  if (!student.last_name || !student.first_name) {
    showMessage('Last name and first name are required.', 'warning');
    return;
  }
  try {
    if (id === '') {
      await api('POST', '/students', student);
      showMessage('Student added.', 'success');
    } else {
      await api('PUT', '/students/' + id, student);
      showMessage('Student updated.', 'success');
    }
    clearStudentForm();
    loadStudents();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

// GET one student by id and put the values in the form
async function editStudent(id) {
  try {
    const s = await api('GET', '/students/' + id);
    document.getElementById('student-id').value = s.student_id;
    document.getElementById('student-last').value = s.last_name;
    document.getElementById('student-first').value = s.first_name;
    document.getElementById('student-email').value = s.email || '';
    document.getElementById('student-save').textContent = 'Save Changes';
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

async function deleteStudent(id) {
  if (!confirm('Delete student ' + id + '?')) return;
  try {
    await api('DELETE', '/students/' + id);
    showMessage('Student deleted.', 'success');
    loadStudents();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

function clearStudentForm() {
  document.getElementById('student-form').reset();
  document.getElementById('student-id').value = '';
  document.getElementById('student-save').textContent = 'Add Student';
}

// ---------- FACULTY ----------

async function loadFaculty() {
  try {
    const faculty = await api('GET', '/faculty');
    let rows = '';
    for (const f of faculty) {
      rows += '<tr><td>' + f.faculty_id + '</td><td>' + esc(f.last_name) + '</td><td>' +
        esc(f.first_name) + '</td><td>' + esc(f.email) + '</td><td>' +
        '<button class="btn btn-sm btn-outline-secondary" onclick="editFaculty(' + f.faculty_id + ')">Edit</button> ' +
        '<button class="btn btn-sm btn-outline-danger" onclick="deleteFaculty(' + f.faculty_id + ')">Delete</button>' +
        '</td></tr>';
    }
    document.getElementById('faculty-table').innerHTML = rows;
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

async function saveFaculty(event) {
  event.preventDefault();
  const id = document.getElementById('faculty-id').value;
  const faculty = {
    last_name: document.getElementById('faculty-last').value.trim(),
    first_name: document.getElementById('faculty-first').value.trim(),
    email: document.getElementById('faculty-email').value.trim()
  };
  if (!faculty.last_name || !faculty.first_name) {
    showMessage('Last name and first name are required.', 'warning');
    return;
  }
  try {
    if (id === '') {
      await api('POST', '/faculty', faculty);
      showMessage('Faculty member added.', 'success');
    } else {
      await api('PUT', '/faculty/' + id, faculty);
      showMessage('Faculty member updated.', 'success');
    }
    clearFacultyForm();
    loadFaculty();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

async function editFaculty(id) {
  try {
    const f = await api('GET', '/faculty/' + id);
    document.getElementById('faculty-id').value = f.faculty_id;
    document.getElementById('faculty-last').value = f.last_name;
    document.getElementById('faculty-first').value = f.first_name;
    document.getElementById('faculty-email').value = f.email || '';
    document.getElementById('faculty-save').textContent = 'Save Changes';
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

async function deleteFaculty(id) {
  if (!confirm('Delete faculty member ' + id + '?')) return;
  try {
    await api('DELETE', '/faculty/' + id);
    showMessage('Faculty member deleted.', 'success');
    loadFaculty();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

function clearFacultyForm() {
  document.getElementById('faculty-form').reset();
  document.getElementById('faculty-id').value = '';
  document.getElementById('faculty-save').textContent = 'Add Faculty';
}

// ---------- COURSES ----------

async function loadCourses() {
  try {
    // fill the faculty dropdown (a course must belong to an existing faculty member)
    const faculty = await api('GET', '/faculty');
    fillSelect('course-faculty', faculty, 'faculty_id', function (f) {
      return f.last_name + ', ' + f.first_name;
    });

    const courses = await api('GET', '/courses');
    let rows = '';
    for (const c of courses) {
      rows += '<tr><td>' + c.course_id + '</td><td>' + esc(c.course_number) + '</td><td>' +
        esc(c.course_name) + '</td><td>' + esc(c.faculty_first_name + ' ' + c.faculty_last_name) + '</td><td>' +
        esc(c.enrollment_limit) + '</td><td>' +
        '<button class="btn btn-sm btn-outline-secondary" onclick="editCourse(' + c.course_id + ')">Edit</button> ' +
        '<button class="btn btn-sm btn-outline-danger" onclick="deleteCourse(' + c.course_id + ')">Delete</button>' +
        '</td></tr>';
    }
    document.getElementById('courses-table').innerHTML = rows;
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

async function saveCourse(event) {
  event.preventDefault();
  const id = document.getElementById('course-id').value;
  const limit = document.getElementById('course-limit').value;
  const course = {
    course_number: document.getElementById('course-number').value.trim(),
    course_name: document.getElementById('course-name').value.trim(),
    faculty_id: Number(document.getElementById('course-faculty').value),
    enrollment_limit: limit === '' ? null : Number(limit)
  };
  if (!course.course_number || !course.faculty_id) {
    showMessage('Course number and faculty are required.', 'warning');
    return;
  }
  try {
    if (id === '') {
      await api('POST', '/courses', course);
      showMessage('Course added.', 'success');
    } else {
      await api('PUT', '/courses/' + id, course);
      showMessage('Course updated.', 'success');
    }
    clearCourseForm();
    loadCourses();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

async function editCourse(id) {
  try {
    const c = await api('GET', '/courses/' + id);
    document.getElementById('course-id').value = c.course_id;
    document.getElementById('course-number').value = c.course_number;
    document.getElementById('course-name').value = c.course_name || '';
    document.getElementById('course-faculty').value = c.faculty_id;
    document.getElementById('course-limit').value = c.enrollment_limit || '';
    document.getElementById('course-save').textContent = 'Save Changes';
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

async function deleteCourse(id) {
  if (!confirm('Delete course ' + id + '?')) return;
  try {
    await api('DELETE', '/courses/' + id);
    showMessage('Course deleted.', 'success');
    loadCourses();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

function clearCourseForm() {
  document.getElementById('course-form').reset();
  document.getElementById('course-id').value = '';
  document.getElementById('course-save').textContent = 'Add Course';
}

// ---------- REGISTRATIONS (student / course) ----------

// One table row for a registration (used by the full list and the roster / schedule)
function registrationRow(r, withButtons) {
  let row = '<tr><td>' + r.id + '</td>' +
    '<td>' + esc(r.student_first_name + ' ' + r.student_last_name) + '</td>' +
    '<td>' + esc(r.course_number + ' ' + (r.course_name || '')) + '</td>' +
    '<td>' + esc(r.faculty_first_name + ' ' + r.faculty_last_name) + '</td>';
  if (withButtons) {
    row += '<td>' +
      '<button class="btn btn-sm btn-outline-secondary" onclick="editRegistration(' + r.id + ')">Edit</button> ' +
      '<button class="btn btn-sm btn-outline-danger" onclick="deleteRegistration(' + r.id + ')">Delete</button>' +
      '</td>';
  }
  return row + '</tr>';
}

async function loadRegistrations() {
  try {
    const students = await api('GET', '/students');
    fillSelect('reg-student', students, 'student_id', function (s) {
      return s.last_name + ', ' + s.first_name;
    });
    const courses = await api('GET', '/courses');
    fillSelect('reg-course', courses, 'course_id', function (c) {
      return c.course_number + ' ' + (c.course_name || '');
    });

    const registrations = await api('GET', '/student-courses');
    let rows = '';
    for (const r of registrations) {
      rows += registrationRow(r, true);
    }
    document.getElementById('registrations-table').innerHTML = rows;
    document.getElementById('reg-detail-title').textContent = '';
    document.getElementById('reg-detail-table').innerHTML = '';
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

async function saveRegistration(event) {
  event.preventDefault();
  const id = document.getElementById('reg-id').value;
  const registration = {
    student_id: Number(document.getElementById('reg-student').value),
    course_id: Number(document.getElementById('reg-course').value)
  };
  if (!registration.student_id || !registration.course_id) {
    showMessage('Pick a student and a course.', 'warning');
    return;
  }
  try {
    if (id === '') {
      await api('POST', '/student-courses', registration);
      showMessage('Student registered.', 'success');
    } else {
      await api('PUT', '/student-courses/' + id, registration);
      showMessage('Registration updated.', 'success');
    }
    clearRegistrationForm();
    loadRegistrations();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

async function editRegistration(id) {
  try {
    const r = await api('GET', '/student-courses/' + id);
    document.getElementById('reg-id').value = r.id;
    document.getElementById('reg-student').value = r.student_id;
    document.getElementById('reg-course').value = r.course_id;
    document.getElementById('reg-save').textContent = 'Save Changes';
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

async function deleteRegistration(id) {
  if (!confirm('Delete registration ' + id + '?')) return;
  try {
    await api('DELETE', '/student-courses/' + id);
    showMessage('Registration deleted.', 'success');
    loadRegistrations();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

// Class roster: everyone registered in the course selected in the form
async function showRoster() {
  const courseId = document.getElementById('reg-course').value;
  if (courseId === '') {
    showMessage('Pick a course first.', 'warning');
    return;
  }
  try {
    const list = await api('GET', '/student-courses/course/' + courseId);
    showDetail('Class roster', list);
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

// Student schedule: every course the student selected in the form is registered for
async function showSchedule() {
  const studentId = document.getElementById('reg-student').value;
  if (studentId === '') {
    showMessage('Pick a student first.', 'warning');
    return;
  }
  try {
    const list = await api('GET', '/student-courses/student/' + studentId);
    showDetail('Student schedule', list);
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

function showDetail(title, list) {
  let rows = '';
  for (const r of list) {
    rows += registrationRow(r, false);
  }
  document.getElementById('reg-detail-title').textContent = title;
  document.getElementById('reg-detail-table').innerHTML =
    rows || '<tr><td colspan="4">No registrations found.</td></tr>';
}

function clearRegistrationForm() {
  document.getElementById('reg-form').reset();
  document.getElementById('reg-id').value = '';
  document.getElementById('reg-save').textContent = 'Register';
}

// load the first tab when the page opens
loadStudents();
