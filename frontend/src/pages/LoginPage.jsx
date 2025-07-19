import React, { useState } from 'react';
import styles from '../styles/LoginPage.module.css';

const LoginPage = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    position: '',
    role: 'employee',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Пока что просто имитируем вход
    onLogin(form.role);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{isRegister ? 'Регистрация' : 'Вход'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className={styles.input} />
        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} required className={styles.input} />
        {isRegister && (
          <>
            <input name="firstName" placeholder="Имя" value={form.firstName} onChange={handleChange} className={styles.input} />
            <input name="lastName" placeholder="Фамилия" value={form.lastName} onChange={handleChange} className={styles.input} />
            <input name="position" placeholder="Должность" value={form.position} onChange={handleChange} className={styles.input} />
            <select name="role" value={form.role} onChange={handleChange} className={styles.input}>
              <option value="employee">Сотрудник</option>
              <option value="manager">Руководитель</option>
            </select>
          </>
        )}
        <button type="submit" className={styles.button}>
          {isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
      <button onClick={() => setIsRegister(r => !r)} className={styles.switch}>
        {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
      </button>
    </div>
  );
};

export default LoginPage; 