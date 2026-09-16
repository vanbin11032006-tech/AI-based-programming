import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Check, Edit3, Trash2, X, Clock, Flame } from 'lucide-react';
import './TodoItem.css';

/**
 * Component TodoItem: Single todo row with toggle, edit inline, delete, and ARIA attributes
 */
export function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditTitle(todo.title);
    setEditPriority(todo.priority || 'medium');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed) {
      onEdit(todo.id, trimmed, editPriority);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditPriority(todo.priority || 'medium');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const priorityLabels = {
    high: { label: 'Ưu tiên cao', class: 'todo-item__priority--high' },
    medium: { label: 'Trung bình', class: 'todo-item__priority--medium' },
    low: { label: 'Thấp', class: 'todo-item__priority--low' },
  };

  const priorityInfo = priorityLabels[todo.priority] || priorityLabels.medium;

  return (
    <li
      className={`todo-item ${todo.completed ? 'todo-item--completed' : ''} ${
        isEditing ? 'todo-item--editing' : ''
      }`}
    >
      {isEditing ? (
        /* Edit Mode */
        <div className="todo-item__edit-container">
          <input
            ref={editInputRef}
            type="text"
            className="todo-item__edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Chỉnh sửa tên công việc"
          />

          <select
            className="todo-item__edit-select"
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            aria-label="Chỉnh sửa mức ưu tiên"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="todo-item__edit-actions">
            <button
              type="button"
              className="todo-item__button todo-item__button--save"
              onClick={handleSaveEdit}
              aria-label="Lưu chỉnh sửa"
              title="Lưu (Enter)"
            >
              <Check size={16} />
            </button>
            <button
              type="button"
              className="todo-item__button todo-item__button--cancel"
              onClick={handleCancelEdit}
              aria-label="Hủy chỉnh sửa"
              title="Hủy (Escape)"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Normal View Mode */
        <div className="todo-item__content">
          <div className="todo-item__left">
            <button
              type="button"
              role="checkbox"
              aria-checked={todo.completed}
              aria-label={`Đánh dấu "${todo.title}" là ${
                todo.completed ? 'chưa hoàn thành' : 'đã hoàn thành'
              }`}
              className={`todo-item__checkbox ${
                todo.completed ? 'todo-item__checkbox--checked' : ''
              }`}
              onClick={() => onToggle(todo.id)}
            >
              {todo.completed && <Check size={14} strokeWidth={3} />}
            </button>

            <div className="todo-item__details">
              <span
                className="todo-item__title"
                onDoubleClick={handleStartEdit}
                title="Nhấp đúp để chỉnh sửa"
              >
                {todo.title}
              </span>

              <div className="todo-item__meta">
                <span className={`todo-item__priority ${priorityInfo.class}`}>
                  {priorityInfo.label}
                </span>

                {todo.createdAt && (
                  <span className="todo-item__date" title="Thời gian tạo">
                    <Clock size={12} />
                    {formatDate(todo.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="todo-item__actions">
            <button
              type="button"
              className="todo-item__button todo-item__button--edit"
              onClick={handleStartEdit}
              aria-label={`Chỉnh sửa "${todo.title}"`}
              title="Chỉnh sửa công việc"
            >
              <Edit3 size={16} />
            </button>

            <button
              type="button"
              className="todo-item__button todo-item__button--delete"
              onClick={() => onDelete(todo.id)}
              aria-label={`Xóa công việc "${todo.title}"`}
              title="Xóa công việc"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string,
    priority: PropTypes.oneOf(['high', 'medium', 'low']),
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
