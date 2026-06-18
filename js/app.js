/**
 * Главное приложение FusCubaX
 */

// Инициализируем модули
const database = new Database();
const authModule = new Auth(database);
const friendsModule = new Friends(database);

// Переменные состояния
let currentUser = null;

/**
 * Инициализирует приложение
 */
function initApp() {
  setupEventListeners();
  checkAuth();
}

/**
 * Проверяет авторизацию
 */
function checkAuth() {
  currentUser = authModule.getCurrentUser();
  
  if (currentUser) {
    showMainApp();
    updateUserProfile();
  } else {
    showAuthApp();
  }
}

/**
 * Показывает приложение аутентификации
 */
function showAuthApp() {
  document.getElementById('auth-container').style.display = 'flex';
  document.getElementById('main-container').style.display = 'none';
}

/**
 * Показывает главное приложение
 */
function showMainApp() {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('main-container').style.display = 'flex';
}

/**
 * Переключает форму (регистрация/вход)
 */
function switchForm(formType) {
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  
  if (formType === 'register') {
    registerForm.style.display = 'flex';
    loginForm.style.display = 'none';
  } else {
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
  }
  
  clearMessage();
}

/**
 * Показывает сообщение об ошибке/успехе
 */
function showMessage(message, isSuccess = true) {
  const messageEl = document.getElementById('auth-message');
  messageEl.textContent = message;
  messageEl.className = 'auth-message ' + (isSuccess ? 'success' : 'error');
}

/**
 * Очищает сообщение
 */
function clearMessage() {
  const messageEl = document.getElementById('auth-message');
  messageEl.textContent = '';
  messageEl.className = 'auth-message';
}

/**
 * Обновляет профиль в интерфейсе
 */
function updateUserProfile() {
  const user = authModule.getCurrentUser();
  if (user) {
    document.querySelector('.user-name').textContent = user.username;
    document.getElementById('profile-username').value = user.username;
    document.getElementById('profile-email').value = user.email;
  }
}

/**
 * Настраивает слушатели событий
 */
function setupEventListeners() {
  // Аутентификация
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('register-form').addEventListener('submit', handleRegister);
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  
  // Навигация
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', handleNavigation);
  });
  
  // Поиск друзей
  document.getElementById('search-input').addEventListener('input', handleSearch);
  
  // Профиль
  document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
}

/**
 * Обработчик входа
 */
function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  
  const result = authModule.login(username, password);
  
  if (result.success) {
    currentUser = result.user;
    showMessage(result.message, true);
    setTimeout(() => {
      showMainApp();
      updateUserProfile();
      loadFriends();
    }, 500);
  } else {
    showMessage(result.message, false);
  }
}

/**
 * Обработчик регистрации
 */
function handleRegister(e) {
  e.preventDefault();
  
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  
  if (password !== confirm) {
    showMessage('Пароли не совпадают', false);
    return;
  }
  
  const result = authModule.register(username, email, password);
  
  if (result.success) {
    showMessage(result.message, true);
    setTimeout(() => {
      clearForm('register');
      switchForm('login');
    }, 1500);
  } else {
    showMessage(result.message, false);
  }
}

/**
 * Обработчик выхода
 */
function handleLogout() {
  if (confirm('Вы уверены, что хотите выйти?')) {
    authModule.logout();
    currentUser = null;
    clearForms();
    showAuthApp();
  }
}

/**
 * Очищает форму
 */
function clearForm(formType) {
  if (formType === 'register') {
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-confirm').value = '';
  } else {
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
  }
}

/**
 * Очищает все формы
 */
function clearForms() {
  clearForm('register');
  clearForm('login');
}

/**
 * Обработчик навигации
 */
function handleNavigation(e) {
  const section = e.target.dataset.section;
  
  // Обновляем активную кнопку
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  
  // Скрываем все секции
  document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
  
  // Показываем нужную секцию
  const sectionId = section + '-section';
  document.getElementById(sectionId).style.display = 'flex';
  
  // Загружаем данные
  if (section === 'friends') {
    loadFriends();
  } else if (section === 'find-friends') {
    document.getElementById('search-input').focus();
  }
}

/**
 * Загружает список друзей
 */
function loadFriends() {
  const friends = friendsModule.getFriends(currentUser.id);
  const container = document.getElementById('friends-list');
  
  if (friends.length === 0) {
    container.innerHTML = '<p>У вас пока нет друзей. <a href="#" onclick="switchToFindFriends()">Найти друзей</a></p>';
    return;
  }
  
  container.innerHTML = friends.map(friend => `
    <div class="friend-card">
      <div class="friend-avatar"></div>
      <div class="friend-info">
        <div class="friend-name">${friend.username}</div>
        <small>${friend.email}</small>
      </div>
      <div class="friend-actions">
        <button onclick="removeFriend(${friend.id})">✕</button>
      </div>
    </div>
  `).join('');
}

/**
 * Переходит к поиску друзей
 */
function switchToFindFriends() {
  document.querySelector('[data-section="find-friends"]').click();
}

/**
 * Обработчик поиска
 */
function handleSearch(e) {
  const searchTerm = e.target.value;
  const resultsContainer = document.getElementById('search-results');
  
  if (searchTerm.length < 2) {
    resultsContainer.innerHTML = '';
    return;
  }
  
  const results = friendsModule.searchUsers(searchTerm, currentUser.id);
  
  resultsContainer.innerHTML = results.map(user => {
    let actionButton = '';
    
    if (user.relationshipStatus === 'friends') {
      actionButton = `<button onclick="removeFriend(${user.id})">В друзьях</button>`;
    } else if (user.relationshipStatus === 'pending_sent') {
      actionButton = `<button disabled>Запрос отправлен</button>`;
    } else if (user.relationshipStatus === 'pending_received') {
      actionButton = `
        <button onclick="acceptFriendRequest(${user.id})">Принять</button>
        <button onclick="rejectFriendRequest(${user.id})">Отклонить</button>
      `;
    } else {
      actionButton = `<button onclick="sendFriendRequest(${user.id})">Добавить в друзья</button>`;
    }
    
    return `
      <div class="user-card">
        <div class="user-avatar-large"></div>
        <div class="user-username">${user.username}</div>
        <div class="user-email">${user.email}</div>
        <div class="user-actions">
          ${actionButton}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Отправляет запрос в друзья
 */
function sendFriendRequest(toUserId) {
  const result = friendsModule.sendRequest(currentUser.id, toUserId);
  
  if (result.success) {
    alert('Запрос отправлен!');
    handleSearch({ target: document.getElementById('search-input') });
  } else {
    alert(result.message);
  }
}

/**
 * Принимает запрос в друзья
 */
function acceptFriendRequest(fromUserId) {
  const result = friendsModule.acceptRequest(currentUser.id, fromUserId);
  
  if (result.success) {
    alert('Друг добавлен!');
    handleSearch({ target: document.getElementById('search-input') });
  } else {
    alert(result.message);
  }
}

/**
 * Отклоняет запрос в друзья
 */
function rejectFriendRequest(fromUserId) {
  const result = friendsModule.rejectRequest(currentUser.id, fromUserId);
  
  if (result.success) {
    alert('Запрос отклонен');
    handleSearch({ target: document.getElementById('search-input') });
  } else {
    alert(result.message);
  }
}

/**
 * Удаляет друга
 */
function removeFriend(friendId) {
  if (confirm('Удалить из друзей?')) {
    const result = friendsModule.removeFriend(currentUser.id, friendId);
    
    if (result.success) {
      loadFriends();
      handleSearch({ target: document.getElementById('search-input') });
    } else {
      alert(result.message);
    }
  }
}

/**
 * Обработчик обновления профиля
 */
function handleProfileUpdate(e) {
  e.preventDefault();
  
  const bio = document.getElementById('profile-bio').value;
  
  const result = authModule.updateProfile({ bio });
  
  if (result.success) {
    alert(result.message);
  } else {
    alert(result.message);
  }
}

// Инициализируем приложение при загрузке
document.addEventListener('DOMContentLoaded', initApp);
