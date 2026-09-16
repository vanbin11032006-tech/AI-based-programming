import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PlusCircle, AlertCircle } from 'lucide-react';
import './TodoInput.css';

/**
 * Component TodoInput: Handles adding new todo item with validation & accessibility
 */
export function TodoInput({ onAddTodo }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setError('Vui lòng nhập nội dung công việc (không để rỗng).');
      return;
    }

    if (trimmed.length > 150) {
      setError('Tên công việc không được vượt quá 150 ký tự.');
      return;
    }

    const success = onAddTodo(trimmed, priority);
    if (success) {
      setTitle('');
      setPriority('medium');
      setError('');
    }
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (error) setError('');
  };

  return (
    <form className="todo-input" onSubmit={handleSubmit} noValidate>
      <div className="todo-input__wrapper">
        <input
          type="text"
          className={`todo-input__field ${error ? 'todo-input__field--error' : ''}`}
          placeholder="Thêm công việc mới cần làm..."
          value={title}
          onChange={handleChange}
          aria-label="Nội dung công việc mới"
          aria-invalid={!!error}
          aria-describedby={error ? 'todo-input-error' : undefined}
          maxLength={150}
        />

        <select
          className="todo-input__select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Mức độ ưu tiên"
        >
          <option value="high">🔥 Ưu tiên cao</option>
          <option value="medium">⚡ Trung bình</option>
          <option value="low">🌱 Thấp</option>
        </select>

        <button
          type="submit"
          className="todo-input__button"
          aria-label="Thêm công việc"
        >
          <PlusCircle size={20} className="todo-input__icon" />
          <span>Thêm</span>
        </button>
      </div>

      {error && (
        <div id="todo-input-error" className="todo-input__error" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}

TodoInput.propTypes = {
  onAddTodo: PropTypes.func.isRequired,
};
