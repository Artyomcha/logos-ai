const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('../models/user');
const { send2FACode } = require('../services/email');

const codes = new Map(); // email -> code (in-memory, для демо)

exports.register = async (req, res) => {
  const { email, password, role, firstName, lastName, position } = req.body;
  const existing = await getUserByEmail(email);
  if (existing) return res.status(400).json({ message: 'Пользователь уже существует' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ email, passwordHash, role, firstName, lastName, position });
  res.json({ id: user.id, email: user.email });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Неверные данные' });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: 'Неверные данные' });
  // Генерируем и отправляем код 2FA
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes.set(email, code);
  await send2FACode(email, code);
  res.json({ message: 'Код отправлен на email' });
};

exports.verify2FA = async (req, res) => {
  const { email, code } = req.body;
  const expected = codes.get(email);
  if (expected !== code) return res.status(401).json({ message: 'Неверный код' });
  codes.delete(email);
  const user = await getUserByEmail(email);
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  res.json({ token });
}; 