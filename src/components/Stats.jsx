import React from 'react';
import PropTypes from 'prop-types';
import { CheckCheck, Trash2, PieChart } from 'lucide-react';
import './Stats.css';

/**
 * Component Stats: Displays summary statistics, completion progress bar, and bulk actions
 */
export function Stats({ stats, onClearCompleted, onToggleAll, allCompleted }) {
  const { total, completed, active, percentage } = stats;

  return (
    <footer className="stats" aria-label="Thống kê công việc">
      {/* Progress Bar */}
      <div className="stats__progress-container">
        <div className="stats__progress-header">
          <span className="stats__progress-title">
            <PieChart size={16} /> Tiễn độ hoàn thành
          </span>
          <span className="stats__progress-percentage">{percentage}%</span>
        </div>
        <div
          className="stats__progress-bar"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Tỷ lệ hoàn thành công việc"
        >
          <div
            className="stats__progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats__summary">
        <div className="stats__item">
          <span className="stats__number">{total}</span>
          <span className="stats__label">Tổng số</span>
        </div>
        <div className="stats__item stats__item--active">
          <span className="stats__number">{active}</span>
          <span className="stats__label">Đang làm</span>
        </div>
        <div className="stats__item stats__item--completed">
          <span className="stats__number">{completed}</span>
          <span className="stats__label">Đã xong</span>
        </div>
      </div>

      {/* Bulk Action Buttons */}
      <div className="stats__actions">
        {total > 0 && (
          <button
            type="button"
            className="stats__button stats__button--toggle-all"
            onClick={() => onToggleAll(!allCompleted)}
            aria-label={allCompleted ? 'Bỏ chọn tất cả' : 'Đánh dấu tất cả hoàn thành'}
          >
            <CheckCheck size={16} />
            <span>{allCompleted ? 'Bỏ chọn tất cả' : 'Hoàn thành tất cả'}</span>
          </button>
        )}

        {completed > 0 && (
          <button
            type="button"
            className="stats__button stats__button--clear"
            onClick={onClearCompleted}
            aria-label="Xóa tất cả các công việc đã hoàn thành"
          >
            <Trash2 size={16} />
            <span>Xóa {completed} việc đã xong</span>
          </button>
        )}
      </div>
    </footer>
  );
}

Stats.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired,
  }).isRequired,
  onClearCompleted: PropTypes.func.isRequired,
  onToggleAll: PropTypes.func.isRequired,
  allCompleted: PropTypes.bool.isRequired,
};
