import React, { useState } from 'react';
import styles from '../styles/LoginPage.module.css';
import { register, login, verify2fa } from '../services/api';

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
  const [step, setStep] = useState('form'); // form | 2fa
  const [emailFor2fa, setEmailFor2fa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register({
          email: form.email,
          password: form.password,
          role: form.role,
          firstName: form.firstName,
          lastName: form.lastName,
          position: form.position,
        });
      }
      await login({ email: form.email, password: form.password });
      setEmailFor2fa(form.email);
      setStep('2fa');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handle2fa = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verify2fa({ email: emailFor2fa, code });
      onLogin(res.role || 'employee');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === '2fa') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Подтверждение входа</h2>
        <form onSubmit={handle2fa}>
          <input
            type="text"
            placeholder="Код из email"
            value={code}
            onChange={e => setCode(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Проверка...' : 'Войти'}
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    );
  }

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
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Загрузка...' : isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
      <button onClick={() => { setIsRegister(r => !r); setError(''); }} className={styles.switch}>
        {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default LoginPage; 