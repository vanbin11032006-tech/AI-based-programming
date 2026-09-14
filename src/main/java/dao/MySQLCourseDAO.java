package dao;

import entity.Course;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MySQLCourseDAO implements CourseDAO {
	private final String url;
	private final String user;
	private final String password;

	public MySQLCourseDAO(String url, String user, String password) {
		this.url = url;
		this.user = user;
		this.password = password;
	}

	@Override
	public void save(Course course) throws Exception {
		String sql = "INSERT INTO courses (name, credits, instructor) VALUES (?, ?, ?)";
		try (Connection connection = getConnection();
			 PreparedStatement statement = connection.prepareStatement(sql, java.sql.Statement.RETURN_GENERATED_KEYS)) {
			setCourseParameters(statement, course, false);
			statement.executeUpdate();
			try (ResultSet keys = statement.getGeneratedKeys()) {
				if (keys.next()) {
					course.setId(keys.getInt(1));
				}
			}
		}
	}

	@Override
	public Course findById(int id) throws Exception {
		String sql = "SELECT id, name, credits, instructor FROM courses WHERE id = ?";
		try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(sql)) {
			statement.setInt(1, id);
			try (ResultSet resultSet = statement.executeQuery()) {
				return resultSet.next() ? mapCourse(resultSet) : null;
			}
		}
	}

	@Override
	public List<Course> findAll() throws Exception {
		return queryCourses("SELECT id, name, credits, instructor FROM courses");
	}

	@Override
	public List<Course> findByName(String name) throws Exception {
		return findByColumn("name", name);
	}

	@Override
	public List<Course> findByInstructor(String instructor) throws Exception {
		return findByColumn("instructor", instructor);
	}

	@Override
	public void update(Course course) throws Exception {
		String sql = "UPDATE courses SET name = ?, credits = ?, instructor = ? WHERE id = ?";
		try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(sql)) {
			setCourseParameters(statement, course, true);
			if (statement.executeUpdate() == 0) {
				throw new IllegalArgumentException("Course not found: " + course.getId());
			}
		}
	}

	@Override
	public void delete(int id) throws Exception {
		try (Connection connection = getConnection();
			 PreparedStatement statement = connection.prepareStatement("DELETE FROM courses WHERE id = ?")) {
			statement.setInt(1, id);
			if (statement.executeUpdate() == 0) {
				throw new IllegalArgumentException("Course not found: " + id);
			}
		}
	}

	private Connection getConnection() throws SQLException {
		return DriverManager.getConnection(url, user, password);
	}

	private List<Course> findByColumn(String column, String value) throws SQLException {
		String sql = "SELECT id, name, credits, instructor FROM courses WHERE " + column + " LIKE ?";
		try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(sql)) {
			statement.setString(1, "%" + value + "%");
			return readCourses(statement);
		}
	}

	private List<Course> queryCourses(String sql) throws SQLException {
		try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(sql)) {
			return readCourses(statement);
		}
	}

	private List<Course> readCourses(PreparedStatement statement) throws SQLException {
		List<Course> courses = new ArrayList<>();
		try (ResultSet resultSet = statement.executeQuery()) {
			while (resultSet.next()) {
				courses.add(mapCourse(resultSet));
			}
		}
		return courses;
	}

	private static void setCourseParameters(PreparedStatement statement, Course course, boolean includeId)
			throws SQLException {
		statement.setString(1, course.getName());
		statement.setInt(2, course.getCredits());
		statement.setString(3, course.getInstructor());
		if (includeId) {
			statement.setInt(4, course.getId());
		}
	}

	private static Course mapCourse(ResultSet resultSet) throws SQLException {
		Course course = new Course(resultSet.getString("name"), resultSet.getInt("credits"),
				resultSet.getString("instructor"));
		course.setId(resultSet.getInt("id"));
		return course;
	}
}
