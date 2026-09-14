package service;

import dao.StudentDAO;
import entity.Student;
import java.util.List;

public class StudentService {
	private final StudentDAO studentDAO;

	public StudentService(StudentDAO studentDAO) {
		if (studentDAO == null) {
			throw new IllegalArgumentException("Student DAO cannot be null");
		}
		this.studentDAO = studentDAO;
	}

	public Student registerStudent(String name, String email, double gpa, String enrollmentDate) throws Exception {
		Student student = new Student(name, email, gpa, enrollmentDate);
		studentDAO.save(student);
		return student;
	}

	public Student getStudent(int id) throws Exception {
		return studentDAO.findById(id);
	}

	public List<Student> getAllStudents() throws Exception {
		return studentDAO.findAll();
	}

	public List<Student> searchStudent(String name) throws Exception {
		return studentDAO.findByName(name);
	}

	public List<Student> findHighPerformers(double minGPA) throws Exception {
		return studentDAO.findStudentsWithHighGPA(minGPA);
	}

	public void updateStudent(Student student) throws Exception {
		studentDAO.update(student);
	}

	public void deleteStudent(int id) throws Exception {
		studentDAO.delete(id);
	}
}
