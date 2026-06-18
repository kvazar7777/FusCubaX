/**
 * Модуль аутентификации для FusCubaX
 * Управляет регистрацией и авторизацией пользователей
 */

class Auth {
  constructor(database) {
    this.db = database;
    this.currentUser = null;
    this.restoreSession();
  }

  /**
   * Восстанавливает сессию из localStorage
   */
  restoreSession() {
    const stored = localStorage.getItem('fuscuba_session');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
      } catch (e) {
        console.error('Ошибка при восстановлении сессии:', e);
      }
    }
  }

  /**
   * Сохраняет сессию
   */
  saveSession() {
    if (this.currentUser) {
      localStorage.setItem('fuscuba_session', JSON.stringify(this.currentUser));
    }
  }

  /**
   * Регистрирует нового пользователя
   */
  register(username, email, password) {
    // Валидация
    if (!username || !email || !password) {
      return { success: false, message: 'Все поля обязательны' };
    }

    if (username.length < 3) {
      return { success: false, message: 'Имя пользователя должно быть минимум 3 символа' };
    }

    if (this.db.getUserByUsername(username)) {
      return { success: false, message: 'Пользователь с таким именем уже существует' };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: 'Некорректный email' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Пароль должен быть минимум 6 символов' };
    }

    // Создаём нового пользователя
    const newUser = {
      id: Date.now(),
      username,
      email,
      password: this.hashPassword(password),
      avatar: `https://ui-avatars.com/api/?name=${username}`,
      bio: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.addUser(newUser);

    return { 
      success: true, 
      message: 'Регистрация успешна! Теперь войдите в аккаунт.',
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    };
  }

  /**
   * Авторизирует пользователя
   */
  login(username, password) {
    if (!username || !password) {
      return { success: false, message: 'Укажите имя пользователя и пароль' };
    }

    const user = this.db.getUserByUsername(username);
    if (!user) {
      return { success: false, message: 'Пользователь не найден' };
    }

    if (!this.verifyPassword(password, user.password)) {
      return { success: false, message: 'Неверный пароль' };
    }

    // Устанавливаем текущего пользователя
    this.currentUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };

    this.saveSession();

    return { 
      success: true, 
      message: 'Вход успешен!',
      user: this.currentUser 
    };
  }

  /**
   * Выходит из аккаунта
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem('fuscuba_session');
    return { success: true, message: 'Вы вышли из аккаунта' };
  }

  /**
   * Получает текущего пользователя
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Проверяет, авторизован ли пользователь
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Простое хеширование пароля
   */
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  /**
   * Проверяет пароль
   */
  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  /**
   * Изменяет пароль
   */
  changePassword(oldPassword, newPassword) {
    if (!this.currentUser) {
      return { success: false, message: 'Необходима авторизация' };
    }

    const user = this.db.getUserById(this.currentUser.id);
    if (!this.verifyPassword(oldPassword, user.password)) {
      return { success: false, message: 'Неверный текущий пароль' };
    }

    this.db.updateUser(user.id, {
      password: this.hashPassword(newPassword),
      updatedAt: new Date().toISOString(),
    });

    return { success: true, message: 'Пароль изменен успешно' };
  }

  /**
   * Обновляет профиль
   */
  updateProfile(updates) {
    if (!this.currentUser) {
      return { success: false, message: 'Необходима авторизация' };
    }

    const allowedFields = ['bio', 'avatar'];
    const filteredUpdates = {};

    for (const field of allowedFields) {
      if (field in updates) {
        filteredUpdates[field] = updates[field];
      }
    }

    filteredUpdates.updatedAt = new Date().toISOString();

    const updatedUser = this.db.updateUser(this.currentUser.id, filteredUpdates);

    if (updatedUser) {
      this.currentUser = {
        ...this.currentUser,
        ...filteredUpdates,
      };
      this.saveSession();
      return { success: true, message: 'Профиль обновлен', user: this.currentUser };
    }

    return { success: false, message: 'Ошибка при обновлении профиля' };
  }

  /**
   * Получает профиль пользователя
   */
  getProfile(userId) {
    const user = this.db.getUserById(userId);
    if (!user) {
      return null;
    }

    const { password, ...profile } = user;
    return profile;
  }
}

// Экспортируем модуль
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Auth;
}
