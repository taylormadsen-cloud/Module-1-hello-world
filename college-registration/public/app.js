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
    let options = '<option value="">Select...</option>';
    for (const f of faculty) {
      options += '<option value="' + f.faculty_id + '">' + esc(f.last_name + ', ' + f.first_name) + '</option>';
    }
    const select = document.getElementById('course-faculty');
    const keep = select.value;
    select.innerHTML = options;
    select.value = keep;

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

// load the first tab when the page opens
loadStudents();
