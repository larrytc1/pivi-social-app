const USERS_STORAGE_KEY = 'piviUsers';
const PASSWORD_HASH_PREFIX = 'sha256:';

function saveUsers(users) {
  const sanitizedUsers = users.map(({ password, ...user }) => user);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(sanitizedUsers));
}

export async function hashPassword(password) {
  const encodedPassword = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', encodedPassword);

  return `${PASSWORD_HASH_PREFIX}${Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')}`;
}

export async function verifyUserPassword(user, password) {
  if (!user) {
    return false;
  }

  if (user.passwordHash) {
    return user.passwordHash === await hashPassword(password);
  }

  return user.password === password;
}

export async function migrateLegacyUserPassword(userId, password) {
  const allUsers = getAllUsers();
  const userIndex = allUsers.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return null;
  }

  allUsers[userIndex] = {
    ...allUsers[userIndex],
    passwordHash: await hashPassword(password)
  };

  delete allUsers[userIndex].password;
  saveUsers(allUsers);
  return allUsers[userIndex];
}

export function saveAllUsers(users) {
  saveUsers(users);
}

export function getUserByEmail(email) {
  const allUsers = getAllUsers();
  return allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function getAllUsers() {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
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
    saveUsers(allUsers);
    console.log('✏️ USER_UPDATED', { userId, ...updates });
    return allUsers[userIndex];
  }
  return null;
}