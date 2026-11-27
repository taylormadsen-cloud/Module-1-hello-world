CREATE DATABASE IF NOT EXISTS college_registration;
USE college_registration;

DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS student;

CREATE TABLE student (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  last_name  VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NULL
);

CREATE TABLE faculty (
  faculty_id INT AUTO_INCREMENT PRIMARY KEY,
  last_name  VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NULL
);

CREATE TABLE course (
  course_id        INT AUTO_INCREMENT PRIMARY KEY,
  course_number    VARCHAR(20)  NOT NULL,
  course_name      VARCHAR(150) NULL,
  faculty_id       INT NOT NULL,
  enrollment_limit INT NULL,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id)
);

-- Sample data
INSERT INTO student (last_name, first_name, email) VALUES
  ('Smith', 'Ana', 'ana@example.edu'),
  ('Lee', 'Ben', NULL);
INSERT INTO faculty (last_name, first_name, email) VALUES
  ('Turing', 'Alan', 'turing@example.edu'),
  ('Hopper', 'Grace', NULL);
INSERT INTO course (course_number, course_name, faculty_id, enrollment_limit) VALUES
  ('CMP311', 'Data Structures', 1, 30),
  ('CMP335', 'Web Development', 2, 25);
