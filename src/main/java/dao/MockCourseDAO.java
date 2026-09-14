package dao;

import entity.Course;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class MockCourseDAO implements CourseDAO {
	private final List<Course> courses = new ArrayList<>();
	private int nextId = 1;

	@Override
	public void save(Course course) {
		requireCourse(course);
		course.setId(nextId++);
		courses.add(course);
	}

	@Override
	public Course findById(int id) {
		return courses.stream()
				.filter(course -> course.getId() == id)
				.findFirst()
				.orElse(null);
	}

	@Override
	public List<Course> findAll() {
		return new ArrayList<>(courses);
	}

	@Override
	public List<Course> findByName(String name) {
		String query = name == null ? "" : name.toLowerCase(Locale.ROOT);
		return courses.stream()
				.filter(course -> course.getName().toLowerCase(Locale.ROOT).contains(query))
				.toList();
	}

	@Override
	public List<Course> findByInstructor(String instructor) {
		String query = instructor == null ? "" : instructor.toLowerCase(Locale.ROOT);
		return courses.stream()
				.filter(course -> course.getInstructor().toLowerCase(Locale.ROOT).contains(query))
				.toList();
	}

	@Override
	public void update(Course course) {
		requireCourse(course);
		Course existing = findById(course.getId());
		if (existing == null) {
			throw new IllegalArgumentException("Course not found: " + course.getId());
		}
		existing.setName(course.getName());
		existing.setCredits(course.getCredits());
		existing.setInstructor(course.getInstructor());
	}

	@Override
	public void delete(int id) {
		if (courses.removeIf(course -> course.getId() == id) == false) {
			throw new IllegalArgumentException("Course not found: " + id);
		}
	}

	private static void requireCourse(Course course) {
		if (course == null) {
			throw new IllegalArgumentException("Course cannot be null");
		}
	}
}
