// Временное хранилище пользователей (in-memory)
const users = [];
let idCounter = 1;

const createUser = async ({ email, passwordHash, role, firstName, lastName, position }) => {
  const user = {
    id: idCounter++,
    email,
    password_hash: passwordHash,
    role,
    first_name: firstName,
    last_name: lastName,
    position,
    created_at: new Date(),
  };
  users.push(user);
  return user;
};

const getUserByEmail = async (email) => {
  return users.find(u => u.email === email);
};

const getUserById = async (id) => {
  return users.find(u => u.id === id);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
}; 