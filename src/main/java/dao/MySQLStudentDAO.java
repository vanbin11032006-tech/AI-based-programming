package dao;

import entity.Student;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MySQLStudentDAO implements StudentDAO {
	private final String url;
	private final String user;
	private final String password;

	public MySQLStudentDAO(String url, String user, String password) {
		this.url = url;
		this.user = user;
		this.password = password;
	}

	@Override
	public void save(Student student) throws Exception {
		String sql = "INSERT INTO students (name, email, gpa, enrollment_date) VALUES (?, ?, ?, ?)";
		try (Connection connection = getConnection();
			 PreparedStatement statement = connection.prepareStatement(sql, java.sql.Statement.RETURN_GENERATED_KEYS)) {
			setStudentParameters(statement, student, false);
			statement.executeUpdate();
			try (ResultSet keys = statement.getGeneratedKeys()) {
				if (keys.next()) {
					student.setId(keys.getInt(1));
				}
			}
		}
	}

	@Override
	public Student findById(int id) throws Exception {
		String sql = "SELECT id, name, email, gpa, enrollment_date FROM students WHERE id = ?";
		try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(sql)) {
			statement.setInt(1, id);
			try (ResultSet resultSet = statement.executeQuery()) {
				return resultSet.next() ? mapStudent(resultSet) : null;
			}
		}
	}

	@Override
	public List<Student> findAll() throws Exception {
		return queryStudents("SELECT id, name, email, gpa, enrollment_date FROM students");
	}

	@Override
	public List<Student> findByName(String name) throws Exception {
		String sql = "SELECT id, name, email, gpa, enrollment_date FROM students WHERE name LIKE ?";
		try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(sql)) {
			statement.setString(1, "%" + name + "%");
			return readStudents(statement);
		}
	}

	@Override
	public void update(Student student) throws Exception {
		String sql = "UPDATE students SET name = ?, email = ?, gpa = ?, enrollment_date = ? WHERE id = ?";
		try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(sql)) {
			setStudentParameters(statement, student, true);
			if (statement.executeUpdate() == 0) {
				throw new IllegalArgumentException("Student not found: " + student.getId());
			}
		}
	}

	@Override
	public void delete(int id) throws Exception {
		try (Connection connection = getConnection();
			 PreparedStatement statement = connection.prepareStatement("DELETE FROM students WHERE id = ?")) {
			statement.setInt(1, id);
			if (statement.executeUpdate() == 0) {
				throw new IllegalArgumentException("Student not found: " + id);
			}
		}
	}

	@Override
	public List<Student> findStudentsWithHighGPA(double minGPA) throws Exception {
		String sql = "SELECT id, name, email, gpa, enrollment_date FROM students WHERE gpa >= ? ORDER BY gpa DESC";
		try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(sql)) {
			statement.setDouble(1, minGPA);
			return readStudents(statement);
		}
	}

	private Connection getConnection() throws SQLException {
		return DriverManager.getConnection(url, user, password);
	}

	private List<Student> queryStudents(String sql) throws SQLException {
		try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(sql)) {
			return readStudents(statement);
		}
	}

	private List<Student> readStudents(PreparedStatement statement) throws SQLException {
		List<Student> students = new ArrayList<>();
		try (ResultSet resultSet = statement.executeQuery()) {
			while (resultSet.next()) {
				students.add(mapStudent(resultSet));
			}
		}
		return students;
	}

	private static void setStudentParameters(PreparedStatement statement, Student student, boolean includeId)
			throws SQLException {
		statement.setString(1, student.getName());
		statement.setString(2, student.getEmail());
		statement.setDouble(3, student.getGpa());
		statement.setString(4, student.getEnrollmentDate());
		if (includeId) {
			statement.setInt(5, student.getId());
		}
	}

	private static Student mapStudent(ResultSet resultSet) throws SQLException {
		Student student = new Student(resultSet.getString("name"), resultSet.getString("email"),
				resultSet.getDouble("gpa"), resultSet.getString("enrollment_date"));
		student.setId(resultSet.getInt("id"));
		return student;
	}
}
