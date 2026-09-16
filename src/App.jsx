import React, { useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TodoInput } from './components/TodoInput';
import { FilterBar } from './components/FilterBar';
import { TodoList } from './components/TodoList';
import { Stats } from './components/Stats';
import { Sun, Moon, CheckSquare } from 'lucide-react';
import './styles/variables.css';
import './App.css';

export function App() {
  const [theme, setTheme] = useLocalStorage('todo_app_theme', 'light');

  const {
    todos,
    filteredTodos,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompleted,
    toggleAll,
    stats,
  } = useTodos();

  // Apply dark mode data attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const allCompleted = todos.length > 0 && todos.every((t) => t.completed);

  return (
    <div className="todo-app-page">
      <div className="todo-app-card">
        {/* Header */}
        <header className="todo-app__header">
          <div className="todo-app__brand">
            <CheckSquare size={32} className="todo-app__logo" />
            <div>
              <h1 className="todo-app__title">Todo List App</h1>
              <p className="todo-app__subtitle">
                Lesson 05 - React Components, Custom Hooks & Accessibility
              </p>
            </div>
          </div>

          <button
            type="button"
            className="todo-app__theme-toggle"
            onClick={toggleTheme}
            aria-label={`Chuyển sang giao diện ${theme === 'light' ? 'Tối (Dark)' : 'Sáng (Light)'}`}
            title="Đổi chủ đề Giao diện"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        {/* Input Form */}
        <section aria-label="Thêm công việc mới">
          <TodoInput onAddTodo={addTodo} />
        </section>

        {/* Filter, Search & Sort Bar */}
        <section aria-label="Bộ lọc và tìm kiếm công việc">
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            counts={{
              total: stats.total,
              active: stats.active,
              completed: stats.completed,
            }}
          />
        </section>

        {/* Todo List */}
        <section aria-label="Danh sách các công việc">
          <TodoList
            todos={filteredTodos}
            filter={filter}
            searchQuery={searchQuery}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onDelete={deleteTodo}
          />
        </section>

        {/* Stats & Progress */}
        <Stats
          stats={stats}
          onClearCompleted={clearCompleted}
          onToggleAll={toggleAll}
          allCompleted={allCompleted}
        />
      </div>
    </div>
  );
}

export default App;
