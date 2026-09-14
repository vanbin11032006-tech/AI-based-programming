package entity;

public class Student {
	private int id;
	private String name;
	private String email;
	private double gpa;
	private String enrollmentDate;

	public Student() {
	}

	public Student(String name, String email, double gpa, String enrollmentDate) {
		setName(name);
		setEmail(email);
		setGpa(gpa);
		setEnrollmentDate(enrollmentDate);
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		if (id < 0) {
			throw new IllegalArgumentException("ID cannot be negative");
		}
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		if (name == null || name.trim().isEmpty()) {
			throw new IllegalArgumentException("Name cannot be empty");
		}
		this.name = name.trim();
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		if (email == null || !email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
			throw new IllegalArgumentException("Invalid email format");
		}
		this.email = email;
	}

	public double getGpa() {
		return gpa;
	}

	public void setGpa(double gpa) {
		if (Double.isNaN(gpa) || gpa < 0.0 || gpa > 4.0) {
			throw new IllegalArgumentException("GPA must be between 0.0 and 4.0");
		}
		this.gpa = gpa;
	}

	public String getEnrollmentDate() {
		return enrollmentDate;
	}

	public void setEnrollmentDate(String enrollmentDate) {
		if (enrollmentDate == null || enrollmentDate.trim().isEmpty()) {
			throw new IllegalArgumentException("Enrollment date cannot be empty");
		}
		this.enrollmentDate = enrollmentDate;
	}

	@Override
	public String toString() {
		return "Student{" +
				"id=" + id +
				", name='" + name + '\'' +
				", email='" + email + '\'' +
				", gpa=" + gpa +
				", enrollmentDate='" + enrollmentDate + '\'' +
				'}';
	}
}
