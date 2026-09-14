import dao.MySQLCourseDAO;
import dao.MySQLStudentDAO;
import dao.StudentDAO;
import service.CourseService;
import service.StudentService;

public class Main {
	public static void main(String[] args) {

		// Cấu hình hiển thị tiếng Việt UTF-8 trên Terminal
		System.setOut(new java.io.PrintStream(
				System.out, true, java.nio.charset.StandardCharsets.UTF_8));
		System.setErr(new java.io.PrintStream(
				System.err, true, java.nio.charset.StandardCharsets.UTF_8));

		String url = "jdbc:mysql://localhost:3306/student_management?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
		String user = "root";
		String password = "";

		try {
			StudentDAO studentDAO = new MySQLStudentDAO(url, user, password);
			StudentService studentService = new StudentService(studentDAO);
			CourseService courseService = new CourseService(
					new MySQLCourseDAO(url, user, password));

			System.out.println("All students:");
			studentService.getAllStudents().forEach(System.out::println);

			System.out.println("High performers:");
			studentService.findHighPerformers(3.5).forEach(System.out::println);

			System.out.println("Courses:");
			courseService.getAllCourses().forEach(System.out::println);

		} catch (Exception exception) {
			System.err.println("Application error: " + exception.getMessage());
		}
	}
}