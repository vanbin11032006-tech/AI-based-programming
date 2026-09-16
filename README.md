# 📝 Todo List App - Lesson 05 (React & Custom Hooks)

Ứng dụng quản lý công việc hàng ngày (**Todo List App**) được thiết kế và triển khai dựa trên kiến trúc phân rã Component trong React, Custom Hooks, BEM CSS, Accessibility (ARIA), và lưu trữ dữ liệu bền vững với LocalStorage.

---

## 🚀 Hướng dẫn Cài đặt & Chạy ứng dụng

### 1. Cài đặt Dependencies
Mở terminal tại thư mục dự án và chạy câu lệnh:
```bash
npm install
```

### 2. Khởi chạy Server Phát triển (Development)
```bash
npm run dev
```
Trình duyệt sẽ tự động chạy tại địa chỉ local (mặc định: `http://localhost:5173`).

### 3. Đóng gói Ứng dụng (Build Production)
```bash
npm run build
```

---

## 📁 Cấu trúc Thư mục Dự án

```text
todo-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/            # 5 Sub-components chính
│   │   ├── TodoInput.jsx      # Nhập todo mới + validation
│   │   ├── TodoInput.css
│   │   ├── FilterBar.jsx      # Lọc status, tìm kiếm realtime & sắp xếp
│   │   ├── FilterBar.css
│   │   ├── TodoList.jsx       # Render danh sách TodoItems hoặc Empty State
│   │   ├── TodoList.css
│   │   ├── TodoItem.jsx       # Hàng todo: Toggle, Inline Edit, Delete
│   │   ├── TodoItem.css
│   │   ├── Stats.jsx          # Thống kê, Progress bar & Bulk actions
│   │   └── Stats.css
│   ├── hooks/                 # Custom Hooks quản lý State & Storage
│   │   ├── useLocalStorage.js # Custom hook đồng bộ window.localStorage
│   │   └── useTodos.js        # Custom hook quản lý toàn bộ CRUD & Filter logic
│   ├── styles/
│   │   └── variables.css      # CSS Variables (Theme Light/Dark, Palette)
│   ├── App.jsx                # Layout chính & Dark mode controller
│   ├── App.css
│   └── main.jsx               # React entry point
├── CHECKLIST.md               # Bảng kiểm soát QA qua 4 lần lặp & chấm điểm
├── README.md                  # Hướng dẫn sử dụng & Kiến trúc
├── index.html                 # HTML template (Google Fonts Inter, ARIA lang="vi")
└── package.json               # Cấu hình dependencies (React, PropTypes, Lucide)
```

---

## 🗺️ Luồng Dữ liệu & Tương tác Component (Data Flow)

```text
                       ┌─────────────────────────┐
                       │        App.jsx          │
                       │  (Dark Mode Controller) │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │       useTodos()        │ ◄──► useLocalStorage()
                       │ (Centralized Todo State)│
                       └────────────┬────────────┘
                                    │
        ┌──────────────────┬────────┴─────────┬──────────────────┐
        │                  │                  │                  │
        ▼                  ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  TodoInput   │   │  FilterBar   │   │   TodoList   │   │    Stats     │
│ (Form Add &  │   │(Tabs, Search │   │ (Render Items│   │(Progress Bar │
│ Validation)  │   │   & Sort)    │   │ & EmptyState)│   │& Bulk Action)│
└──────────────┘   └──────────────┘   └──────┬───────┘   └──────────────┘
                                             │
                                             ▼
                                      ┌──────────────┐
                                      │   TodoItem   │
                                      │(Toggle, Edit │
                                      │   & Delete)  │
                                      └──────────────┘
```

---

## ⭐ Các Tính năng Nổi bật

1. **Quản lý Todo Linh hoạt (CRUD)**:
   - Thêm công việc mới kèm mức độ ưu tiên (High / Medium / Low).
   - Validation thông minh chống chuỗi rỗng / khoảng trắng và giới hạn độ dài.
   - Chỉnh sửa tên & priority trực tiếp inline (Hỗ trợ phím `Enter` lưu, `Escape` hủy).
   - Đánh dấu hoàn thành đơn lẻ hoặc thao tác hàng loạt (`Hoàn thành tất cả`).
   - Xóa đơn lẻ hoặc xóa nhanh toàn bộ công việc đã hoàn thành (`Clear Completed`).

2. **Lọc, Tìm kiếm & Sắp xếp Nâng cao**:
   - Chuyển đổi giữa 3 tab: `Tất cả` | `Đang làm` | `Đã xong`.
   - Tìm kiếm từ khóa tiêu đề tức thì (Realtime search).
   - Sắp xếp theo: `Mới nhất`, `Cũ nhất`, `Ưu tiên cao nhất`, `Tên A-Z`.

3. **Giao diện & Trải nghiệm Nguồn Mở (UI/UX)**:
   - Thiết kế theo chuẩn quy tắc đặt tên **BEM (Block Element Modifier)**.
   - Hỗ trợ giao diện **Light Mode** & **Dark Mode** mượt mà.
   - Thống kê sinh động với thanh Tiến độ (Progress bar) tự động tính toán tỷ lệ %.
   - Empty State minh họa trực quan khi không tìm thấy kết quả.

4. **Khả năng Truy cập & Phím tắt (Accessibility - ARIA)**:
   - Tối ưu cho người dùng điều hướng bằng bàn phím (`Tab`, `Enter`, `Space`, `Escape`).
   - Gắn thuộc tính `aria-label`, `aria-checked`, `role="tablist"`, `role="progressbar"`.

---

## 🛠️ Hướng dẫn Xử lý Sự cố (Troubleshooting)

| Sự cố phát sinh | Nguyên nhân khả dĩ | Giải pháp xử lý |
| :--- | :--- | :--- |
| **Không lưu được dữ liệu khi F5** | Trình duyệt bị khóa LocalStorage hoặc đang ở chế độ Riêng tư (Incognito) | Mở cài đặt browser, cấp quyền lưu Cookies/LocalStorage hoặc chạy ở chế độ thường. |
| **Cảnh báo PropTypes Warning trong Console** | Trái kiểu dữ liệu truyền vào Props | Kiểm tra lại phần định nghĩa `PropTypes` tại component tương ứng. |
| **Icon không hiển thị** | Chưa cài đặt gói `lucide-react` | Chạy lệnh `npm install lucide-react` để bổ sung thư viện icon. |
