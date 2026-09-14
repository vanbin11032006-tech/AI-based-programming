package dao;

import entity.Student;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

public class MockStudentDAO implements StudentDAO {
	private final List<Student> students = new ArrayList<>();
	private int nextId = 1;

	@Override
	public void save(Student student) {
		requireStudent(student);
		student.setId(nextId++);
		students.add(student);
	}

	@Override
	public Student findById(int id) {
		return students.stream()
				.filter(student -> student.getId() == id)
				.findFirst()
				.orElse(null);
	}

	@Override
	public List<Student> findAll() {
		return new ArrayList<>(students);
	}

	@Override
	public List<Student> findByName(String name) {
		String query = name == null ? "" : name.toLowerCase(Locale.ROOT);
		return students.stream()
				.filter(student -> student.getName().toLowerCase(Locale.ROOT).contains(query))
				.toList();
	}

	@Override
	public void update(Student student) {
		requireStudent(student);
		Student existing = findById(student.getId());
		if (existing == null) {
			throw new IllegalArgumentException("Student not found: " + student.getId());
		}
		existing.setName(student.getName());
		existing.setEmail(student.getEmail());
		existing.setGpa(student.getGpa());
		existing.setEnrollmentDate(student.getEnrollmentDate());
	}

	@Override
	public void delete(int id) {
		if (students.removeIf(student -> student.getId() == id) == false) {
			throw new IllegalArgumentException("Student not found: " + id);
		}
	}

	@Override
	public List<Student> findStudentsWithHighGPA(double minGPA) {
		validateGpa(minGPA);
		return students.stream()
				.filter(student -> student.getGpa() >= minGPA)
				.sorted(Comparator.comparingDouble(Student::getGpa).reversed())
				.toList();
	}

	private static void requireStudent(Student student) {
		if (student == null) {
			throw new IllegalArgumentException("Student cannot be null");
		}
	}

	private static void validateGpa(double gpa) {
		if (Double.isNaN(gpa) || gpa < 0.0 || gpa > 4.0) {
			throw new IllegalArgumentException("GPA must be between 0.0 and 4.0");
		}
	}
}
