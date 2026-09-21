import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import './AuthModal.css';

export function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (activeTab === 'login') {
        await login(emailOrUsername, password);
      } else {
        await register(username, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Thao tác thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError(null);
  };

  return (
    <div className="auth-modal__overlay" onClick={onClose}>
      <div className="auth-modal__content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="auth-modal__close"
          onClick={onClose}
          aria-label="Đóng bảng đăng nhập"
        >
          <X size={20} />
        </button>

        <div className="auth-modal__header">
          <h2 className="auth-modal__title">FORGE<span>.</span> AUTH</h2>
          <p className="auth-modal__subtitle">Đăng nhập để đồng bộ kế hoạch tập luyện cá nhân</p>
        </div>

        <div className="auth-modal__tabs">
          <button
            type="button"
            className={`auth-modal__tab ${activeTab === 'login' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            className={`auth-modal__tab ${activeTab === 'register' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Đăng Ký
          </button>
        </div>

        {error && <div className="auth-modal__error">⚠️ {error}</div>}

        <form className="auth-modal__form" onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className="auth-modal__field">
              <label htmlFor="auth-username">Tên người dùng</label>
              <div className="auth-modal__input-group">
                <User size={18} className="auth-modal__input-icon" />
                <input
                  id="auth-username"
                  type="text"
                  className="auth-modal__input"
                  placeholder="Nhập tên đăng nhập..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-modal__field">
            <label htmlFor="auth-email">
              {activeTab === 'login' ? 'Email hoặc Tên người dùng' : 'Địa chỉ Email'}
            </label>
            <div className="auth-modal__input-group">
              <Mail size={18} className="auth-modal__input-icon" />
              <input
                id="auth-email"
                type={activeTab === 'login' ? 'text' : 'email'}
                className="auth-modal__input"
                placeholder={activeTab === 'login' ? 'Email hoặc username...' : 'example@domain.com'}
                value={activeTab === 'login' ? emailOrUsername : email}
                onChange={(e) =>
                  activeTab === 'login'
                    ? setEmailOrUsername(e.target.value)
                    : setEmail(e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="auth-modal__field">
            <label htmlFor="auth-password">Mật khẩu</label>
            <div className="auth-modal__input-group">
              <Lock size={18} className="auth-modal__input-icon" />
              <input
                id="auth-password"
                type="password"
                className="auth-modal__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-modal__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Đang xử lý...'
            ) : activeTab === 'login' ? (
              <>
                <LogIn size={18} /> Đăng Nhập
              </>
            ) : (
              <>
                <UserPlus size={18} /> Tạo Tài Khoản
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
