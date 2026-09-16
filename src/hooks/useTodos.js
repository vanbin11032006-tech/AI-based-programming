import { useState, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

const INITIAL_TODOS = [
  {
    id: '1',
    title: 'Học React Components & State Management',
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    priority: 'high',
  },
  {
    id: '2',
    title: 'Phân rã Component cho ứng dụng Todo List',
    completed: true,
    createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Áp dụng BEM CSS và Responsive Design',
    completed: false,
    createdAt: new Date().toISOString(),
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Thực hiện kiểm thử theo CHECKLIST.md',
    completed: false,
    createdAt: new Date().toISOString(),
    priority: 'low',
  },
];

export function useTodos() {
  const [todos, setTodos] = useLocalStorage('todo_app_items_v1', INITIAL_TODOS);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'title-asc' | 'priority-desc'

  // Add new todo
  const addTodo = (title, priority = 'medium') => {
    const trimmed = title.trim();
    if (!trimmed) return false;

    const newTodo = {
      id: Date.now().toString(),
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
    };

    setTodos((prev) => [newTodo, ...prev]);
    return true;
  };

  // Toggle completed status
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
          : todo
      )
    );
  };

  // Edit todo title & priority
  const editTodo = (id, newTitle, newPriority) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return false;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              title: trimmed,
              priority: newPriority || todo.priority,
              updatedAt: new Date().toISOString(),
            }
          : todo
      )
    );
    return true;
  };

  // Delete single todo
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  // Toggle all todos
  const toggleAll = (shouldComplete) => {
    setTodos((prev) =>
      prev.map((todo) => ({
        ...todo,
        completed: shouldComplete,
        updatedAt: new Date().toISOString(),
      }))
    );
  };

  // Compute filtered & sorted list
  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        // Filter by tab status
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true; // 'all'
      })
      .filter((todo) => {
        // Search query filter
        if (!searchQuery.trim()) return true;
        return todo.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
      })
      .sort((a, b) => {
        // Sorting logic
        if (sortBy === 'date-asc') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'priority-desc') {
          const priorityMap = { high: 3, medium: 2, low: 1 };
          return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
        }
        // Default: date-desc
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [todos, filter, searchQuery, sortBy]);

  // Compute statistics
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, active, percentage };
  }, [todos]);

  return {
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
  };
}
