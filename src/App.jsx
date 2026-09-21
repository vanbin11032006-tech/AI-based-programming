import React, { useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TodoInput } from './components/TodoInput';
import { FilterBar } from './components/FilterBar';
import { TodoList } from './components/TodoList';
import { Stats } from './components/Stats';
import { Sun, Moon, Dumbbell, ArrowUpRight, Play } from 'lucide-react';
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
      <div className="todo-app-shell">
        <header className="todo-app__header">
          <div className="todo-app__brand">
            <Dumbbell size={25} className="todo-app__logo" />
            <span className="todo-app__wordmark">FORGE<span>.</span></span>
          </div>

          <nav className="todo-app__nav" aria-label="Điều hướng chính">
            <a href="#schedule">Lịch tập</a>
            <a href="#progress">Tiến độ</a>
            <a href="#about">Về Forge</a>
          </nav>

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

        <main>
          <section className="todo-app__hero" id="about">
            <div className="todo-app__hero-copy">
              <p className="todo-app__eyebrow"><span /> Đặt mục tiêu. Bắt đầu ngay.</p>
              <h1 className="todo-app__title">BUILD<br /><em>YOUR</em> BEST<br />SELF.</h1>
              <p className="todo-app__subtitle">Kỷ luật tạo nên khác biệt. Lập kế hoạch buổi tập, theo dõi tiến độ và biến từng ngày thành một phiên bản mạnh mẽ hơn.</p>
              <a className="todo-app__hero-cta" href="#schedule">Bắt đầu lịch tập <ArrowUpRight size={18} /></a>
            </div>
            <div className="todo-app__hero-image">
              <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=85" alt="Vận động viên đang tập luyện" />
              <div className="todo-app__image-note"><Play size={14} fill="currentColor" /> TRAIN HARD / LIVE WELL</div>
            </div>
          </section>

          <section className="todo-app__workspace" id="schedule">
            <div className="todo-app__section-heading">
              <div>
                <p className="todo-app__eyebrow"><span /> Kế hoạch cá nhân</p>
                <h2>HÔM NAY BẠN SẼ<br /><em>CHINH PHỤC</em> ĐIỀU GÌ?</h2>
              </div>
              <p className="todo-app__section-meta">01 / 04<br /><small>DAILY FOCUS</small></p>
            </div>

            <section aria-label="Thêm công việc mới">
              <TodoInput onAddTodo={addTodo} />
            </section>

            <section aria-label="Bộ lọc và tìm kiếm công việc">
              <FilterBar
                filter={filter}
                onFilterChange={setFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                counts={{ total: stats.total, active: stats.active, completed: stats.completed }}
              />
            </section>

            <section aria-label="Danh sách các công việc">
              <TodoList todos={filteredTodos} filter={filter} searchQuery={searchQuery} onToggle={toggleTodo} onEdit={editTodo} onDelete={deleteTodo} />
            </section>

            <div id="progress">
              <Stats stats={stats} onClearCompleted={clearCompleted} onToggleAll={toggleAll} allCompleted={allCompleted} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
