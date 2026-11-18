CREATE DATABASE college_registration;
USE college_registration;

CREATE TABLE student (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  last_name  VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  email      VARCHAR(100) NULL
);

CREATE TABLE faculty (
  faculty_id INT AUTO_INCREMENT PRIMARY KEY,
  last_name  VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  email      VARCHAR(100) NULL
);

CREATE TABLE course (
  course_id        INT AUTO_INCREMENT PRIMARY KEY,
  course_number    VARCHAR(10) NOT NULL,      -- e.g. CMP335
  course_name      VARCHAR(100),
  faculty_id       INT,
  enrollment_limit INT,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id)
);

CREATE TABLE student_course (
  student_id INT NOT NULL,
  course_id  INT NOT NULL,
  PRIMARY KEY (student_id, course_id),        -- enforces unique combo
  FOREIGN KEY (student_id) REFERENCES student(student_id),
  FOREIGN KEY (course_id)  REFERENCES course(course_id)
);