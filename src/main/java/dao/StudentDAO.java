package dao;

import entity.Student;
import java.util.List;

public interface StudentDAO {
	void save(Student student) throws Exception;
	Student findById(int id) throws Exception;
	List<Student> findAll() throws Exception;
	List<Student> findByName(String name) throws Exception;
	void update(Student student) throws Exception;
	void delete(int id) throws Exception;
	List<Student> findStudentsWithHighGPA(double minGPA) throws Exception;
}
