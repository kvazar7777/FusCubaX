/**
 * Модуль управления друзьями для FusCubaX
 * Управляет добавлением/удалением друзей и запросами
 */

class Friends {
  constructor(database) {
    this.db = database;
  }

  /**
   * Отправляет запрос в друзья
   */
  sendRequest(fromUserId, toUserId) {
    if (fromUserId === toUserId) {
      return { success: false, message: 'Нельзя добавить себя в друзья' };
    }

    const toUser = this.db.getUserById(toUserId);
    if (!toUser) {
      return { success: false, message: 'Пользователь не найден' };
    }

    // Проверяем, не друзья ли они уже
    const existing = this.db.getFriendship(fromUserId, toUserId);
    if (existing && existing.status === 'accepted') {
      return { success: false, message: 'Вы уже в друзьях' };
    }

    if (existing && existing.status === 'pending') {
      return { success: false, message: 'Запрос уже отправлен' };
    }

    // Удаляем старую запись если есть
    if (existing) {
      this.db.removeFriendship(existing.id);
    }

    // Создаём новый запрос
    const friendship = this.db.addFriendship({
      user1Id: fromUserId,
      user2Id: toUserId,
      status: 'pending',
    });

    return { success: true, message: 'Запрос отправлен', friendship };
  }

  /**
   * Принимает запрос в друзья
   */
  acceptRequest(userId, fromUserId) {
    const friendship = this.db.getFriendship(userId, fromUserId);
    
    if (!friendship) {
      return { success: false, message: 'Запрос не найден' };
    }

    if (friendship.status === 'accepted') {
      return { success: false, message: 'Вы уже в друзьях' };
    }

    friendship.status = 'accepted';
    friendship.acceptedAt = new Date().toISOString();
    this.db.addFriendship(friendship);

    return { success: true, message: 'Запрос принят', friendship };
  }

  /**
   * Отклоняет запрос в друзья
   */
  rejectRequest(userId, fromUserId) {
    const friendship = this.db.getFriendship(userId, fromUserId);
    
    if (!friendship) {
      return { success: false, message: 'Запрос не найден' };
    }

    this.db.removeFriendship(friendship.id);

    return { success: true, message: 'Запрос отклонен' };
  }

  /**
   * Удаляет друга
   */
  removeFriend(userId1, userId2) {
    const friendship = this.db.getFriendship(userId1, userId2);
    
    if (!friendship) {
      return { success: false, message: 'Пользователь не в списке друзей' };
    }

    this.db.removeFriendship(friendship.id);

    return { success: true, message: 'Друг удален' };
  }

  /**
   * Получает список друзей
   */
  getFriends(userId) {
    return this.db.getUserFriends(userId);
  }

  /**
   * Получает входящие запросы
   */
  getIncomingRequests(userId) {
    const friendships = this.db.db.friendships.filter(f => 
      f.user2Id === userId && f.status === 'pending'
    );

    return friendships.map(f => {
      const user = this.db.getUserById(f.user1Id);
      return {
        id: f.id,
        user: { id: user.id, username: user.username, avatar: user.avatar },
        createdAt: f.createdAt,
      };
    });
  }

  /**
   * Получает исходящие запросы
   */
  getOutgoingRequests(userId) {
    const friendships = this.db.db.friendships.filter(f => 
      f.user1Id === userId && f.status === 'pending'
    );

    return friendships.map(f => {
      const user = this.db.getUserById(f.user2Id);
      return {
        id: f.id,
        user: { id: user.id, username: user.username, avatar: user.avatar },
        createdAt: f.createdAt,
      };
    });
  }

  /**
   * Проверяет, друзья ли два пользователя
   */
  areFriends(userId1, userId2) {
    const friendship = this.db.getFriendship(userId1, userId2);
    return friendship && friendship.status === 'accepted';
  }

  /**
   * Получает статус отношения между пользователями
   */
  getRelationshipStatus(userId1, userId2) {
    const friendship = this.db.getFriendship(userId1, userId2);
    
    if (!friendship) {
      return 'none';
    }

    if (friendship.status === 'accepted') {
      return 'friends';
    }

    if (friendship.user1Id === userId1) {
      return 'pending_sent';
    } else {
      return 'pending_received';
    }
  }

  /**
   * Ищет пользователей
   */
  searchUsers(searchTerm, currentUserId) {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    const results = this.db.getAllUsers().filter(user => 
      user.id !== currentUserId &&
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return results.map(user => {
      const { password, ...profile } = user;
      return {
        ...profile,
        relationshipStatus: this.getRelationshipStatus(currentUserId, user.id),
      };
    });
  }
}

// Экспортируем модуль
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Friends;
}
