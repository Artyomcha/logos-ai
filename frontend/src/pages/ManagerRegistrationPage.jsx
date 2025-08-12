import React, { useState, useEffect } from 'react';
import { register, getCompaniesList } from '../services/api';
import styles from '../styles/LoginPage.module.css';

const ManagerRegistrationPage = ({ onBack }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'employee', // По умолчанию сотрудник
    companyName: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companiesData = await getCompaniesList();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error loading companies:', error);
        setError('Ошибка загрузки списка компаний');
      }
    };
    loadCompanies();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = e => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    
    try {
      if (!form.companyName) {
        setError('Пожалуйста, укажите компанию');
        setLoading(false);
        return;
      }
      
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role, // Используем выбранную роль
        companyName: form.companyName,
        avatar: avatar,
      });
      
      setSuccess(true);
      setForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'employee',
        companyName: '',
      });
      setAvatar(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Пользователь зарегистрирован!</h2>
        <p style={{ color: '#00e0d3', textAlign: 'center', marginBottom: '20px' }}>
          Пользователь успешно создан в системе.
        </p>
        <p style={{ color: '#4CAF50', textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>
          ✓ Данные для входа отправлены на email пользователя
        </p>
        <button onClick={() => setSuccess(false)} className={styles.button}>
          Зарегистрировать еще одного пользователя
        </button>
        <button onClick={onBack} className={styles.switch}>
          Вернуться к входу
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Регистрация пользователя</h2>
      <p style={{ color: '#00e0d3', textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>
        Создание нового пользователя компании
      </p>
      
      <form onSubmit={handleSubmit}>
        <input 
          name="email" 
          type="email" 
          placeholder="Email менеджера" 
          value={form.email} 
          onChange={handleChange} 
          required 
          className={styles.input} 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Пароль" 
          value={form.password} 
          onChange={handleChange} 
          required 
          className={styles.input} 
        />
        <input 
          name="firstName" 
          placeholder="Имя" 
          value={form.firstName} 
          onChange={handleChange} 
          required 
          className={styles.input} 
        />
        <input 
          name="lastName" 
          placeholder="Фамилия" 
          value={form.lastName} 
          onChange={handleChange} 
          required 
          className={styles.input} 
        />
        
        <div className={styles.companyField}>
          <label>Роль:</label>
          <select 
            name="role" 
            value={form.role} 
            onChange={handleChange} 
            className={styles.input}
            required
          >
            <option value="employee">Сотрудник</option>
            <option value="manager">Менеджер</option>
          </select>
        </div>
        
        <div className={styles.companyField}>
          <label>Компания:</label>
          <select 
            name="companyName" 
            value={form.companyName} 
            onChange={handleChange} 
            className={styles.input}
            required
          >
            <option value="">Выберите компанию</option>
            {companies
              .filter(company => {
                const companyName = company.database_name?.replace('logos_ai_', '') || company.companyName;
                return companyName !== 'main'; // Скрываем компанию main
              })
              .map((company, index) => (
                <option key={index} value={company.database_name?.replace('logos_ai_', '') || company.companyName}>
                  {company.database_name?.replace('logos_ai_', '') || company.companyName}
                </option>
              ))}
          </select>
        </div>
        
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleAvatarChange} 
          className={styles.inputform} 
        />
        
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Создание...' : 'Создать пользователя'}
        </button>
      </form>
      
      <button onClick={onBack} className={styles.switch}>
        Вернуться к входу
      </button>
      
      {error && <div style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{error}</div>}
    </div>
  );
};

export default ManagerRegistrationPage; 