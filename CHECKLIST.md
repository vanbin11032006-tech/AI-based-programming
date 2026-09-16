# 📋 Quality Assurance & Evaluation Checklist - Todo List App (Lesson 05)

Bảng kiểm soát chất lượng giúp theo dõi tiến độ phát triển qua **4 Lần lặp (Iterative Development)** và tự chấm điểm dự án theo yêu cầu bài tập.

---

## 🔄 Lần lặp 1: Scaffolding (Dựng khung & Cấu trúc Component)

- [x] **Khởi tạo dự án React**: Thiết lập môi trường React + Vite (hoặc CRA) sạch sẽ.
- [x] **Cấu hình Dependencies**: Cài đặt và cấu hình thư viện `prop-types` và `lucide-react`.
- [x] **Phân rã 5 Sub-components chính**:
  - [x] `TodoInput.jsx` - Component nhận công việc mới + mức ưu tiên.
  - [x] `FilterBar.jsx` - Component quản lý các tab lọc (All/Active/Completed), ô tìm kiếm và menu sắp xếp.
  - [x] `TodoList.jsx` - Container hiển thị danh sách các `TodoItem` hoặc Empty State.
  - [x] `TodoItem.jsx` - Hiển thị từng dòng todo, toggle, sửa inline và xóa.
  - [x] `Stats.jsx` - Thống kê số lượng, thanh tiến độ % hoàn thành và nút thao tác hàng loạt.
- [x] **PropTypes Validation**: Đã khai báo đầy đủ `PropTypes` cho tất cả props trong cả 5 sub-components.

---

## ⚡ Lần lặp 2: Interactivity (Logic & Quản lý State)

- [x] **Thêm Todo mới (`TodoInput`)**:
  - [x] Validation chống nhập chuỗi rỗng / chỉ chứa khoảng trắng.
  - [x] Giới hạn độ dài tối đa 150 ký tự.
  - [x] Hiển thị thông báo lỗi rõ ràng bên dưới input.
- [x] **Tương tác trên từng Todo (`TodoItem`)**:
  - [x] Đánh dấu hoàn thành / chưa hoàn thành.
  - [x] Chỉnh sửa inline (Nhấp nút Edit hoặc nhấp đúp tiêu đề, lưu bằng Enter / nút Save, hủy bằng Escape / nút Cancel).
  - [x] Xóa công việc đơn lẻ.
- [x] **Lọc, Tìm kiếm & Sắp xếp (`FilterBar` & `useTodos`)**:
  - [x] Bộ lọc theo 3 trạng thái: `Tất cả` | `Đang làm` | `Đã xong`.
  - [x] Tìm kiếm realtime theo từ khóa tiêu đề task.
  - [x] Sắp xếp linh hoạt: Mới nhất, Cũ nhất, Ưu tiên cao nhất, Tên (A-Z).
- [x] **Đồng bộ LocalStorage (`useLocalStorage`)**:
  - [x] Khởi tạo custom hook `useLocalStorage`.
  - [x] Lưu trữ trạng thái todos tự động vào browser storage, tự khôi phục dữ liệu khi F5 refresh.
  - [x] Đóng gói toàn bộ CRUD logic vào custom hook `useTodos`.

---

## 🎨 Lần lặp 3: Styling (BEM Methodology & Responsive Design)

- [x] **Quy chuẩn BEM (Block Element Modifier)**:
  - [x] Sử dụng class BEM chuẩn: `.todo-input__field`, `.filter-bar__tab--active`, `.todo-item--completed`, `.stats__progress-fill`, v.v.
  - [x] Tách CSS theo từng component riêng biệt (`TodoInput.css`, `FilterBar.css`, v.v.).
- [x] **Responsive Layout**:
  - [x] Tối ưu hiển thị hoàn hảo trên Mobile (<640px), Tablet (768px), và Desktop (>1024px).
  - [x] Tự động chuyển đổi layout từ hàng ngang (flex row) sang hàng dọc (flex col) trên màn hình nhỏ.
- [x] **Focus & Hover Styles**:
  - [x] Hiệu ứng focus ring rõ ràng khi dùng phím `Tab`.
  - [x] Transition mượt mà cho hover buttons, checkboxes, và progress bar.

---

## ♿ Lần lặp 4: Polish (Accessibility, Keyboard Nav & Dark Mode)

- [x] **Accessibility (ARIA Labels & Roles)**:
  - [x] Thêm `aria-label`, `aria-checked`, `aria-invalid`, `aria-describedby` cho các nút bấm và ô nhập liệu.
  - [x] Cấu hình `role="tablist"`, `role="tab"`, `role="progressbar"`, `role="checkbox"`, `role="list"`.
  - [x] Thêm `lang="vi"` chuẩn hóa truy cập giọng đọc màn hình (Screen Readers).
- [x] **Phím tắt Keyboard Navigation**:
  - [x] Phím `Enter` để submit form thêm mới hoặc lưu chỉnh sửa.
  - [x] Phím `Escape` để hủy chế độ chỉnh sửa inline.
  - [x] Hỗ trợ điều hướng bằng phím `Tab` xuyên suốt toàn bộ ứng dụng.
- [x] **Dark Mode Theme (Optional Bonus)**:
  - [x] Tích hợp nút toggle chuyển đổi giao diện Sáng / Tối (Light / Dark mode).
  - [x] Sử dụng CSS Variables định nghĩa màu sắc ở `:root` và `[data-theme='dark']`.
  - [x] Lưu lựa chọn theme vào `localStorage`.

---

## 📊 Đánh giá & Tự chấm điểm

| Hạng mục đánh giá | Tiêu chí | Trạng thái | Điểm tối đa | Điểm đạt được |
| :--- | :--- | :---: | :---: | :---: |
| **1. Cấu trúc Component & PropTypes** | Phân rã 5 components chuẩn, validate PropTypes đầy đủ | 🟢 Hoàn thành | 2.5 | **2.5 / 2.5** |
| **2. Logic CRUD & LocalStorage** | Thêm/Sửa/Xóa/Lọc/Search/Sort/Custom Hooks hoạt động chính xác | 🟢 Hoàn thành | 3.5 | **3.5 / 3.5** |
| **3. Styling & Responsive BEM** | Áp dụng BEM, CSS Variables, co giãn responsive Mobile/Tablet/Desktop | 🟢 Hoàn thành | 2.0 | **2.0 / 2.0** |
| **4. Accessibility & Dark Mode** | ARIA attributes đầy đủ, Keyboard navigation, Dark mode switch | 🟢 Hoàn thành | 2.0 | **2.0 / 2.0** |
| **TỔNG ĐIỂM** | | | **10.0** | **10.0 / 10.0** |
