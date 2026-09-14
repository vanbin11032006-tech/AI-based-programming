CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    gpa DECIMAL(3, 2) NOT NULL,
    enrollment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    credits INT NOT NULL,
    instructor VARCHAR(100) NOT NULL
);

INSERT INTO students (name, email, gpa, enrollment_date) VALUES
('Nguyen Van A', 'a@university.edu', 3.50, '2023-09-01'),
('Tran Thi B', 'b@university.edu', 3.80, '2023-09-01'),
('Pham Cong C', 'c@university.edu', 3.20, '2023-09-15')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO courses (name, credits, instructor) VALUES
('Object-Oriented Programming', 3, 'Nguyen Van Giang'),
('Database Systems', 3, 'Tran Thi Lan');
CREATE DATABASE IF NOT EXISTS student_management;

USE student_management;

-- =========================
-- TABLE STUDENTS
-- =========================

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    gpa DECIMAL(3, 2),
    enrollment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- Sample students
INSERT INTO students
(name, email, gpa, enrollment_date)
VALUES
('Nguyễn Văn A', 'a@university.edu', 3.5, '2023-09-01'),
('Trần Thị B', 'b@university.edu', 3.8, '2023-09-01'),
('Phạm Công C', 'c@university.edu', 3.2, '2023-09-15');


-- =========================
-- TABLE COURSES
-- =========================

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    instructor VARCHAR(100) NOT NULL
);

-- Sample courses
INSERT INTO courses
(name, credits, instructor)
VALUES
('Lập trình Java', 3, 'Nguyễn Văn Minh'),
('Cơ sở dữ liệu', 3, 'Trần Thị Lan'),
('Lập trình Web', 4, 'Phạm Văn Nam');