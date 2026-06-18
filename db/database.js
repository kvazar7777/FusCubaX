/**
 * Модуль базы данных для FusCubaX
 * Управляет всеми данными приложения
 */

class Database {
  constructor() {
    this.db = {
      users: [],
      messages: [],
      conversations: [],
      friendships: [],
    };
    this.loadFromStorage();
  }

  /**
   * Загружает данные из localStorage
   */
  loadFromStorage() {
    const stored = localStorage.getItem('fuscuba_db');
    if (stored) {
      try {
        this.db = JSON.parse(stored);
      } catch (e) {
        console.error('Ошибка при загрузке БД:', e);
      }
    }
  }

  /**
   * Сохраняет данные в localStorage
   */
  saveToStorage() {
    localStorage.setItem('fuscuba_db', JSON.stringify(this.db));
  }

  /**
   * Добавляет пользователя в БД
   */
  addUser(user) {
    this.db.users.push(user);
    this.saveToStorage();
  }

  /**
   * Получает пользователя по ID
   */
  getUserById(id) {
    return this.db.users.find(u => u.id === id);
  }

  /**
   * Получает пользователя по имени
   */
  getUserByUsername(username) {
    return this.db.users.find(u => u.username === username);
  }

  /**
   * Получает всех пользователей
   */
  getAllUsers() {
    return this.db.users;
  }

  /**
   * Обновляет пользователя
   */
  updateUser(id, updates) {
    const user = this.getUserById(id);
    if (user) {
      Object.assign(user, updates);
      this.saveToStorage();
      return user;
    }
    return null;
  }

  /**
   * Добавляет сообщение
   */
  addMessage(message) {
    message.id = Date.now();
    message.timestamp = new Date().toISOString();
    this.db.messages.push(message);
    this.saveToStorage();
    return message;
  }

  /**
   * Получает сообщения по ID разговора
   */
  getMessagesByConversation(conversationId) {
    return this.db.messages.filter(m => m.conversationId === conversationId);
  }

  /**
   * Удаляет сообщение
   */
  deleteMessage(id) {
    this.db.messages = this.db.messages.filter(m => m.id !== id);
    this.saveToStorage();
  }

  /**
   * Создает новый разговор
   */
  createConversation(conversation) {
    conversation.id = Date.now();
    conversation.createdAt = new Date().toISOString();
    this.db.conversations.push(conversation);
    this.saveToStorage();
    return conversation;
  }

  /**
   * Получает разговор по ID
   */
  getConversation(id) {
    return this.db.conversations.find(c => c.id === id);
  }

  /**
   * Получает разговоры пользователя
   */
  getUserConversations(userId) {
    return this.db.conversations.filter(c => 
      c.participants.includes(userId)
    );
  }

  /**
   * Обновляет разговор
   */
  updateConversation(id, updates) {
    const conversation = this.getConversation(id);
    if (conversation) {
      Object.assign(conversation, updates);
      this.saveToStorage();
      return conversation;
    }
    return null;
  }

  /**
   * Добавляет дружбу
   */
  addFriendship(friendship) {
    friendship.id = Date.now();
    friendship.createdAt = new Date().toISOString();
    this.db.friendships.push(friendship);
    this.saveToStorage();
    return friendship;
  }

  /**
   * Получает дружбу по ID пользователей
   */
  getFriendship(userId1, userId2) {
    return this.db.friendships.find(f => 
      (f.user1Id === userId1 && f.user2Id === userId2) ||
      (f.user1Id === userId2 && f.user2Id === userId1)
    );
  }

  /**
   * Получает всех друзей пользователя
   */
  getUserFriends(userId) {
    const friendships = this.db.friendships.filter(f => 
      (f.user1Id === userId || f.user2Id === userId) && f.status === 'accepted'
    );
    
    return friendships.map(f => {
      const friendId = f.user1Id === userId ? f.user2Id : f.user1Id;
      return this.getUserById(friendId);
    }).filter(u => u !== null);
  }

  /**
   * Удаляет дружбу
   */
  removeFriendship(id) {
    this.db.friendships = this.db.friendships.filter(f => f.id !== id);
    this.saveToStorage();
  }

  /**
   * Получает статистику
   */
  getStats() {
    return {
      totalUsers: this.db.users.length,
      totalMessages: this.db.messages.length,
      totalConversations: this.db.conversations.length,
      totalFriendships: this.db.friendships.filter(f => f.status === 'accepted').length,
    };
  }

  /**
   * Очищает всю БД
   */
  clear() {
    this.db = {
      users: [],
      messages: [],
      conversations: [],
      friendships: [],
    };
    localStorage.removeItem('fuscuba_db');
  }
}

// Экспортируем БД
const database = new Database();
if (typeof module !== 'undefined' && module.exports) {
  module.exports = database;
}
