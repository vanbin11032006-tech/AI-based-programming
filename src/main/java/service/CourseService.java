package service;

import dao.CourseDAO;
import entity.Course;
import java.util.List;

public class CourseService {
	private final CourseDAO courseDAO;

	public CourseService(CourseDAO courseDAO) {
		if (courseDAO == null) {
			throw new IllegalArgumentException("Course DAO cannot be null");
		}
		this.courseDAO = courseDAO;
	}

	public Course createCourse(String name, int credits, String instructor) throws Exception {
		Course course = new Course(name, credits, instructor);
		courseDAO.save(course);
		return course;
	}

	public Course getCourse(int id) throws Exception {
		return courseDAO.findById(id);
	}

	public List<Course> getAllCourses() throws Exception {
		return courseDAO.findAll();
	}

	public List<Course> searchByName(String name) throws Exception {
		return courseDAO.findByName(name);
	}

	public List<Course> searchByInstructor(String instructor) throws Exception {
		return courseDAO.findByInstructor(instructor);
	}

	public void updateCourse(Course course) throws Exception {
		courseDAO.update(course);
	}

	public void deleteCourse(int id) throws Exception {
		courseDAO.delete(id);
	}
}
