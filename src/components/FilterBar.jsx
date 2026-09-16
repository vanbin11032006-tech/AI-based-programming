import React from 'react';
import PropTypes from 'prop-types';
import { Search, X, ArrowUpDown } from 'lucide-react';
import './FilterBar.css';

/**
 * Component FilterBar: Handles filtering tabs, search input, and sorting order
 */
export function FilterBar({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  counts,
}) {
  const tabs = [
    { key: 'all', label: 'Tất cả', count: counts.total },
    { key: 'active', label: 'Đang làm', count: counts.active },
    { key: 'completed', label: 'Đã xong', count: counts.completed },
  ];

  return (
    <div className="filter-bar">
      {/* Tabs */}
      <div className="filter-bar__tabs" role="tablist" aria-label="Lọc trạng thái công việc">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={filter === tab.key}
            aria-controls="todo-list-panel"
            className={`filter-bar__tab ${
              filter === tab.key ? 'filter-bar__tab--active' : ''
            }`}
            onClick={() => onFilterChange(tab.key)}
          >
            <span>{tab.label}</span>
            <span className="filter-bar__badge">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Controls: Search & Sort */}
      <div className="filter-bar__controls">
        {/* Search */}
        <div className="filter-bar__search">
          <Search size={16} className="filter-bar__search-icon" />
          <input
            type="text"
            className="filter-bar__search-input"
            placeholder="Tìm kiếm công việc..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Tìm kiếm công việc theo từ khóa"
          />
          {searchQuery && (
            <button
              type="button"
              className="filter-bar__search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="filter-bar__sort">
          <ArrowUpDown size={16} className="filter-bar__sort-icon" />
          <select
            className="filter-bar__sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sắp xếp danh sách công việc"
          >
            <option value="date-desc">Mới nhất</option>
            <option value="date-asc">Cũ nhất</option>
            <option value="priority-desc">Ưu tiên cao nhất</option>
            <option value="title-asc">Tên (A - Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  filter: PropTypes.oneOf(['all', 'active', 'completed']).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    total: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
  }).isRequired,
};
