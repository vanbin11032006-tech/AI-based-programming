# Student DAO với Java và MySQL

## Cấu trúc

- `entity`: mô hình `Student` và `Course`, có đóng gói và kiểm tra dữ liệu.
- `dao`: interface DAO và hai loại triển khai Mock/MySQL.
- `service`: nghiệp vụ phụ thuộc vào interface DAO, không phụ thuộc JDBC cụ thể.
- `src/test/java`: unit test dùng Mock DAO nên không cần chạy MySQL.

## Chạy unit test

Yêu cầu JDK 17 và Maven:

```bash
mvn test
```

## Chạy với MySQL

1. Chạy `database.sql` trong MySQL.
2. Đổi `user` và `password` trong `src/main/java/Main.java`.
3. Chạy:

```bash
mvn compile exec:java -Dexec.mainClass=Main
```

Nếu chưa cấu hình Maven Exec Plugin, có thể chạy class `Main` trực tiếp từ IDE.

## Áp dụng OOP và SOLID

- Encapsulation: thuộc tính entity là `private`, truy cập qua getter/setter có validation.
- Abstraction và polymorphism: service làm việc với `StudentDAO`/`CourseDAO`; Mock và MySQL là các triển khai thay thế.
- SRP: entity, DAO và service có trách nhiệm riêng.
- DIP: service nhận DAO qua constructor.
- OCP: có thể thêm triển khai DAO mới mà không đổi service.

## Trả lời câu hỏi thảo luận

DAO tách JDBC khỏi nghiệp vụ, giúp service dễ đọc, dễ bảo trì và dễ kiểm thử. Khi đổi sang PostgreSQL hoặc MongoDB, chỉ cần tạo triển khai DAO tương ứng; service và entity có thể giữ nguyên nếu hợp đồng dữ liệu không đổi.

Mock DAO dùng để test nhanh, ổn định và không phụ thuộc database. MySQL DAO dùng khi chạy thật và kiểm tra tích hợp với cơ sở dữ liệu.

Các cải tiến có thể bổ sung là connection pooling, pagination, caching và transaction management.
