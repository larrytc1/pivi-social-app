export function getUserByEmail(email) {
  const allUsers = getAllUsers();
  return allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function getAllUsers() {
  const users = localStorage.getItem('piviUsers');
  return users ? JSON.parse(users) : [];
}

export function getUserById(userId) {
  const allUsers = getAllUsers();
  return allUsers.find(user => user.id === userId);
}

export function updateUser(userId, updates) {
  const allUsers = getAllUsers();
  const userIndex = allUsers.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    allUsers[userIndex] = { ...allUsers[userIndex], ...updates };
    localStorage.setItem('piviUsers', JSON.stringify(allUsers));
    console.log('✏️ USER_UPDATED', { userId, ...updates });
    return allUsers[userIndex];
  }
  return null;
}