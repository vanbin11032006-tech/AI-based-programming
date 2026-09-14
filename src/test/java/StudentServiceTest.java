import dao.MockStudentDAO;
import dao.StudentDAO;
import entity.Student;
import org.junit.Before;
import org.junit.Test;
import service.StudentService;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class StudentServiceTest {
	private StudentDAO studentDAO;
	private StudentService service;

	@Before
	public void setUp() {
		studentDAO = new MockStudentDAO();
		service = new StudentService(studentDAO);
	}

	@Test
	public void saveAndFindById() throws Exception {
		Student saved = service.registerStudent("Test Student", "test@test.com", 3.5, "2024-01-01");

		Student found = studentDAO.findById(saved.getId());

		assertNotNull(found);
		assertEquals("Test Student", found.getName());
	}

	@Test
	public void findAllReturnsAllStudents() throws Exception {
		service.registerStudent("Student A", "a@test.com", 3.0, "2024-01-01");
		service.registerStudent("Student B", "b@test.com", 3.2, "2024-01-01");

		assertEquals(2, service.getAllStudents().size());
	}

	@Test
	public void updateChangesStudentData() throws Exception {
		Student student = service.registerStudent("Old Name", "old@test.com", 3.0, "2024-01-01");
		student.setName("New Name");
		student.setGpa(3.9);

		service.updateStudent(student);

		assertEquals("New Name", service.getStudent(student.getId()).getName());
		assertEquals(3.9, service.getStudent(student.getId()).getGpa(), 0.001);
	}

	@Test
	public void deleteRemovesStudent() throws Exception {
		Student student = service.registerStudent("To Delete", "delete@test.com", 2.5, "2024-01-01");

		service.deleteStudent(student.getId());

		assertNull(service.getStudent(student.getId()));
	}

	@Test
	public void highGpaStudentsAreFilteredAndSorted() throws Exception {
		service.registerStudent("A", "a@high.test", 3.7, "2024-01-01");
		service.registerStudent("B", "b@high.test", 3.2, "2024-01-01");
		service.registerStudent("C", "c@high.test", 3.9, "2024-01-01");

		List<Student> result = service.findHighPerformers(3.5);

		assertEquals(2, result.size());
		assertEquals("C", result.get(0).getName());
		assertEquals("A", result.get(1).getName());
	}

	@Test(expected = IllegalArgumentException.class)
	public void invalidGpaIsRejected() {
		new Student("Invalid", "invalid@test.com", 5.0, "2024-01-01");
	}
}
