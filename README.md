# FusCubaX - Браузерный мессенджер

Примитивный браузерный мессенджер, созданный на HTML, CSS и JavaScript с использованием localStorage для хранения данных.

## 🎯 Особенности

### 1. **Аутентификация и авторизация**
- ✅ Регистрация новых пользователей с валидацией
- ✅ Вход в аккаунт с сохранением сессии
- ✅ Выход из аккаунта
- ✅ Простое хеширование пароля

### 2. **Управление друзьями**
- ✅ Отправка запросов в друзья
- ✅ Принятие/отклонение запросов
- ✅ Удаление из друзей
- ✅ Просмотр списка друзей
- ✅ Поиск пользователей

### 3. **База данных**
- ✅ Хранение пользователей в localStorage
- ✅ Хранение сообщений
- ✅ Хранение разговоров
- ✅ Хранение отношений между друзьями

### 4. **Интерфейс**
- ✅ Адаптивный дизайн
- ✅ Красивые градиенты и анимации
- ✅ Интуитивная навигация

## 📁 Структура проекта

```
FusCubaX/
├── index.html           # Главный HTML файл
├── manager.js           # Менеджер состояния
├── README.md            # Документация
│
├── db/
│   └── database.js      # Модуль базы данных
│
├── auth/
│   └── auth.js          # Модуль аутентификации
│
├── friends/
│   └── friends.js       # Модуль управления друзьями
│
├── styles/
│   └── main.css         # Основные стили
│
└── js/
    └── app.js           # Главное приложение
```

## 🚀 Как использовать

### Запуск
1. Откройте файл `index.html` в браузере
2. Создайте новый аккаунт или используйте существующий

### Регистрация
- Нажмите "Зарегистрироваться"
- Заполните поля: имя пользователя, email, пароль
- Подтвердите пароль

### Авторизация
- Введите имя пользователя и пароль
- Нажмите "Войти"

### Управление друзьями
1. Перейдите в раздел "Найти друзей"
2. Введите имя пользователя в поле поиска
3. Нажмите "Добавить в друзья"
4. Принимайте входящие запросы в разделе "Друзья"

## 📊 API модулей

### Database
```javascript
const database = new Database();

database.addUser(user);
database.getUserById(id);
database.getUserByUsername(username);
database.addMessage(message);
database.createConversation(conversation);
database.addFriendship(friendship);
```

### Auth
```javascript
const auth = new Auth(database);

auth.register(username, email, password);
auth.login(username, password);
auth.logout();
auth.getCurrentUser();
auth.isAuthenticated();
auth.updateProfile(updates);
```

### Friends
```javascript
const friends = new Friends(database);

friends.sendRequest(fromUserId, toUserId);
friends.acceptRequest(userId, fromUserId);
friends.rejectRequest(userId, fromUserId);
friends.removeFriend(userId1, userId2);
friends.getFriends(userId);
friends.getIncomingRequests(userId);
```

## 🔒 Безопасность

⚠️ **Важно:** Это примитивное приложение для обучения!

Для продакшена необходимо:
- Использовать bcrypt для хеширования паролей
- Передавать данные по HTTPS
- Реализовать серверную аутентификацию
- Использовать JWT токены
- Защитить от CSRF атак

## 💾 Хранение данных

Все данные хранятся в `localStorage` браузера:
- `fuscuba_users` - Список пользователей
- `fuscuba_db` - База данных (сообщения, разговоры)
- `fuscuba_session` - Текущая сессия

## 🎨 Палитра цветов

- Основной: #667eea
- Дополнительный: #764ba2
- Фон: #f5f5f5
- Текст: #333

## 📱 Браузеры

Работает в:
- Chrome
- Firefox
- Safari
- Edge

## 📝 TODO

- [ ] Добавить отправку сообщений
- [ ] Реализовать видеозвонки
- [ ] Добавить уведомления
- [ ] Реализовать групповые чаты
- [ ] Добавить загрузку аватаров
- [ ] Реализовать шифрование сообщений

## 📄 Лицензия

MIT License

## 👤 Автор

Created for FusCubaX Project
