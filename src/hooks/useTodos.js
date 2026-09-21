import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = '/api/todos';

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token, user } = useAuth();

  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'title-asc' | 'priority-desc'

  const getAuthHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    const currentToken = token || localStorage.getItem('forge_auth_token');
    if (currentToken) {
      headers.Authorization = `Bearer ${currentToken}`;
    }
    return headers;
  }, [token]);

  // 1. Fetch all todos from MongoDB API
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Lỗi từ Server (${res.status})`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error('Fetch todos error:', err);
      setError('Không thể kết nối đến MongoDB API. Vui lòng kiểm tra Server và MONGODB_URI.');
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const currentToken = token || localStorage.getItem('forge_auth_token');
        const headers = currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
        const res = await fetch(API_BASE, { headers });
        if (!res.ok) throw new Error(`Lỗi từ Server (${res.status})`);
        const data = await res.json();
        if (isMounted) setTodos(data);
      } catch (err) {
        console.error('Fetch todos error:', err);
        if (isMounted) setError('Không thể kết nối đến MongoDB API. Vui lòng kiểm tra Server và MONGODB_URI.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [token, user]);

  // 2. Add new todo
  const addTodo = async (title, priority = 'medium') => {
    const trimmed = title.trim();
    if (!trimmed) return false;

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: trimmed, priority }),
      });

      if (!res.ok) throw new Error('Thêm công việc thất bại');
      const createdTodo = await res.json();

      setTodos((prev) => [createdTodo, ...prev]);
      return true;
    } catch (err) {
      console.error('Add todo error:', err);
      setError(err.message);
      return false;
    }
  };

  // 3. Toggle completed status
  const toggleTodo = async (id) => {
    const targetTodo = todos.find((t) => t.id === id);
    if (!targetTodo) return;

    const updatedStatus = !targetTodo.completed;

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: updatedStatus } : t))
    );

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ completed: updatedStatus }),
      });

      if (!res.ok) {
        // Revert on error
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: !updatedStatus } : t))
        );
        throw new Error('Cập nhật trạng thái thất bại');
      }
    } catch (err) {
      console.error('Toggle todo error:', err);
      setError(err.message);
    }
  };

  // 4. Edit todo title & priority
  const editTodo = async (id, newTitle, newPriority) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return false;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: trimmed, priority: newPriority }),
      });

      if (!res.ok) throw new Error('Sửa công việc thất bại');
      const updatedTodo = await res.json();

      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
      return true;
    } catch (err) {
      console.error('Edit todo error:', err);
      setError(err.message);
      return false;
    }
  };

  // 5. Delete single todo
  const deleteTodo = async (id) => {
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        setTodos(previousTodos);
        throw new Error('Xóa công việc thất bại');
      }
    } catch (err) {
      console.error('Delete todo error:', err);
      setError(err.message);
    }
  };

  // 6. Clear all completed todos
  const clearCompleted = async () => {
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((t) => !t.completed));

    try {
      const res = await fetch(`${API_BASE}/completed`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        setTodos(previousTodos);
        throw new Error('Xóa công việc đã hoàn thành thất bại');
      }
    } catch (err) {
      console.error('Clear completed error:', err);
      setError(err.message);
    }
  };

  // 7. Toggle all todos
  const toggleAll = async (shouldComplete) => {
    const previousTodos = [...todos];
    setTodos((prev) => prev.map((t) => ({ ...t, completed: shouldComplete })));

    try {
      const res = await fetch(`${API_BASE}/toggle-all`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ completed: shouldComplete }),
      });

      if (!res.ok) {
        setTodos(previousTodos);
        throw new Error('Cập nhật tất cả công việc thất bại');
      }
    } catch (err) {
      console.error('Toggle all error:', err);
      setError(err.message);
    }
  };

  // Compute filtered & sorted list
  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true; // 'all'
      })
      .filter((todo) => {
        if (!searchQuery.trim()) return true;
        return todo.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
      })
      .sort((a, b) => {
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
    isLoading,
    error,
    refetch: fetchTodos,
  };
}
