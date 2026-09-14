import dao.CourseDAO;
import dao.MockCourseDAO;
import entity.Course;
import org.junit.Before;
import org.junit.Test;
import service.CourseService;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class CourseServiceTest {
	private CourseService service;

	@Before
	public void setUp() {
		CourseDAO courseDAO = new MockCourseDAO();
		service = new CourseService(courseDAO);
	}

	@Test
	public void courseCrudWorks() throws Exception {
		Course course = service.createCourse("Java", 3, "Instructor A");
		assertNotNull(service.getCourse(course.getId()));

		course.setCredits(4);
		service.updateCourse(course);
		assertEquals(4, service.getCourse(course.getId()).getCredits());

		service.deleteCourse(course.getId());
		assertNull(service.getCourse(course.getId()));
	}

	@Test
	public void courseCanBeSearchedByInstructor() throws Exception {
		service.createCourse("Java", 3, "Instructor A");
		service.createCourse("SQL", 3, "Instructor B");

		assertEquals(1, service.searchByInstructor("instructor b").size());
	}
}
