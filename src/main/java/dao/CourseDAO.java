package dao;

import entity.Course;
import java.util.List;

public interface CourseDAO {
	void save(Course course) throws Exception;
	Course findById(int id) throws Exception;
	List<Course> findAll() throws Exception;
	List<Course> findByName(String name) throws Exception;
	List<Course> findByInstructor(String instructor) throws Exception;
	void update(Course course) throws Exception;
	void delete(int id) throws Exception;
}
