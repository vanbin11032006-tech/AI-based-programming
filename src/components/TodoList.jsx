import React from 'react';
import PropTypes from 'prop-types';
import { TodoItem } from './TodoItem';
import { CheckCircle2, Inbox } from 'lucide-react';
import './TodoList.css';

/**
 * Component TodoList: Renders list of TodoItems or Empty State illustration
 */
export function TodoList({ todos, filter, searchQuery, onToggle, onEdit, onDelete }) {
  if (todos.length === 0) {
    let emptyMessage = 'Chưa có công việc nào trong danh sách. Hãy thêm công việc mới!';
    let EmptyIcon = Inbox;

    if (searchQuery) {
      emptyMessage = `Không tìm thấy công việc phù hợp với từ khóa "${searchQuery}".`;
    } else if (filter === 'active') {
      emptyMessage = 'Tuyệt vời! Bạn không có công việc nào đang chờ xử lý.';
      EmptyIcon = CheckCircle2;
    } else if (filter === 'completed') {
      emptyMessage = 'Chưa có công việc nào hoàn thành. Hãy tiếp tục cố gắng!';
    }

    return (
      <div className="todo-list__empty" role="status">
        <EmptyIcon className="todo-list__empty-icon" size={48} />
        <p className="todo-list__empty-text">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="todo-list" id="todo-list-panel" aria-label="Danh sách công việc">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      createdAt: PropTypes.string,
      priority: PropTypes.oneOf(['high', 'medium', 'low']),
    })
  ).isRequired,
  filter: PropTypes.string.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
