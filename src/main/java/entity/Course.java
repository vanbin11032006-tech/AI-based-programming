package entity;

public class Course {
	private int id;
	private String name;
	private int credits;
	private String instructor;

	public Course() {
	}

	public Course(String name, int credits, String instructor) {
		setName(name);
		setCredits(credits);
		setInstructor(instructor);
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
			throw new IllegalArgumentException("Course name cannot be empty");
		}
		this.name = name.trim();
	}

	public int getCredits() {
		return credits;
	}

	public void setCredits(int credits) {
		if (credits <= 0) {
			throw new IllegalArgumentException("Credits must be greater than zero");
		}
		this.credits = credits;
	}

	public String getInstructor() {
		return instructor;
	}

	public void setInstructor(String instructor) {
		if (instructor == null || instructor.trim().isEmpty()) {
			throw new IllegalArgumentException("Instructor cannot be empty");
		}
		this.instructor = instructor.trim();
	}

	@Override
	public String toString() {
		return "Course{" +
				"id=" + id +
				", name='" + name + '\'' +
				", credits=" + credits +
				", instructor='" + instructor + '\'' +
				'}';
	}
}
