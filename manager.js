/**
 * Примитивный менеджер для FusCubaX
 * Управляет состоянием приложения и координирует компоненты
 */

class Manager {
  constructor() {
    this.state = {
      user: null,
      messages: [],
      contacts: [],
      isConnected: false,
      currentChat: null,
    };
    this.listeners = [];
  }

  /**
   * Подписывает слушателя на изменения состояния
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Уведомляет всех слушателей об изменениях
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Устанавливает пользователя
   */
  setUser(user) {
    this.state.user = user;
    this.notifyListeners();
  }

  /**
   * Получает пользователя
   */
  getUser() {
    return this.state.user;
  }

  /**
   * Добавляет новое сообщение
   */
  addMessage(message) {
    this.state.messages.push(message);
    this.notifyListeners();
  }

  /**
   * Получает все сообщения
   */
  getMessages() {
    return this.state.messages;
  }

  /**
   * Добавляет контакт
   */
  addContact(contact) {
    this.state.contacts.push(contact);
    this.notifyListeners();
  }

  /**
   * Получает все контакты
   */
  getContacts() {
    return this.state.contacts;
  }

  /**
   * Устанавливает статус соединения
   */
  setConnected(isConnected) {
    this.state.isConnected = isConnected;
    this.notifyListeners();
  }

  /**
   * Проверяет, подключено ли приложение
   */
  isConnected() {
    return this.state.isConnected;
  }

  /**
   * Устанавливает текущий чат
   */
  setCurrentChat(chatId) {
    this.state.currentChat = chatId;
    this.notifyListeners();
  }

  /**
   * Получает текущий чат
   */
  getCurrentChat() {
    return this.state.currentChat;
  }

  /**
   * Очищает состояние
   */
  reset() {
    this.state = {
      user: null,
      messages: [],
      contacts: [],
      isConnected: false,
      currentChat: null,
    };
    this.notifyListeners();
  }

  /**
   * Получает полное состояние
   */
  getState() {
    return { ...this.state };
  }
}

// Создаём глобальный экземпляр менеджера
const manager = new Manager();

// Экспортируем для использования в модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = manager;
}
