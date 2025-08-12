import React, { useState, useEffect } from 'react';
import styles from '../styles/LoginPage.module.css';
import { 
  login, 
  verify2fa, 
  getCompaniesList, 
  getUserCompanies,
  requestPasswordReset,
  verifyPasswordReset
} from '../services/api';
import ManagerRegistrationPage from './ManagerRegistrationPage';

const LoginPage = ({ onLogin }) => {
  const [showManagerRegistration, setShowManagerRegistration] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  // Проверяем, доступна ли регистрация менеджера
  const isManagerRegistrationEnabled = () => {
    // Вариант 1: По URL параметру
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') return true;
    
    // Вариант 2: По специальному URL
    if (window.location.pathname.includes('/admin')) return true;
    
    // Вариант 3: По переменной окружения (если настроена)
    if (process.env.REACT_APP_ENABLE_MANAGER_REGISTRATION === 'true') return true;
    
    return false;
  };

  // Новый процесс входа: email -> companies -> password -> 2fa
  const [step, setStep] = useState('email'); // email | companies | password | 2fa
  const [email, setEmail] = useState('');
  const [userCompanies, setUserCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  // Добавляем состояние для сброса пароля
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState('email'); // email | code | newPassword

  // Добавляем состояние для подтверждения пароля
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Добавляем отладку состояния
  useEffect(() => {
    console.log('LoginPage state changed:', {
      showPasswordReset,
      resetEmail,
      resetStep
    });
  }, [showPasswordReset, resetEmail, resetStep]);

  // Шаг 1: Ввод email
  const handleEmailSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email) {
      setError('Email обязателен');
      setLoading(false);
      return;
    }
    
    try {
      const response = await getUserCompanies(email);
      if (response.companies && response.companies.length > 0) {
        setUserCompanies(response.companies);
        setStep('companies');
      } else {
        setError('Пользователь с таким email не найден ни в одной компании');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Шаг 2: Выбор компании
  const handleCompanySelect = (companyName) => {
    setSelectedCompany(companyName);
    setStep('password');
  };

  // Шаг 3: Ввод пароля
  const handlePasswordSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!password) {
      setError('Пароль обязателен');
      setLoading(false);
      return;
      }
    
    try {
      await login(email, password, selectedCompany);
      setStep('2fa');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Шаг 4: 2FA верификация
  const handle2fa = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verify2fa(email, code);
      console.log('Login successful - token:', res.token ? res.token.substring(0, 20) + '...' : 'null');
      console.log('Login successful - companyName:', res.companyName);
      console.log('Login successful - role:', res.role);
      // Очищаем localStorage перед сохранением новых данных
      localStorage.clear();
      localStorage.setItem('token', res.token);
      localStorage.setItem('companyName', res.companyName);
      onLogin(res.role);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Функции для сброса пароля
  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    console.log('handlePasswordResetRequest called with email:', resetEmail);
    setError('');
    setLoading(true);
    
    try {
      console.log('Calling requestPasswordReset...');
      await requestPasswordReset(resetEmail);
      console.log('requestPasswordReset successful');
      setResetStep('code');
    } catch (e) {
      console.error('requestPasswordReset error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetVerify = async (e) => {
    e.preventDefault();
    setError('');
    
    // Проверяем совпадение паролей
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    // Проверяем минимальную длину пароля
    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    setLoading(true);
    
    try {
      await verifyPasswordReset(resetEmail, resetCode, newPassword);
      setError('Пароль успешно изменен! Теперь можете войти с новым паролем.');
      setShowPasswordReset(false);
      setResetStep('email');
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Возврат к предыдущему шагу
  const goBack = () => {
    if (step === 'companies') {
      setStep('email');
      setUserCompanies([]);
    } else if (step === 'password') {
      setStep('companies');
      setSelectedCompany('');
      setPassword('');
    } else if (step === '2fa') {
      setStep('password');
      setCode('');
    }
  };

  // Модальное окно сброса пароля
  if (showPasswordReset) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Сброс пароля</h2>
        
        {resetStep === 'email' && (
          <form onSubmit={handlePasswordResetRequest}>
            <p style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
              Введите email для сброса пароля
            </p>
            <input
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Отправка...' : 'Отправить код'}
            </button>
          </form>
        )}
        
        {resetStep === 'code' && (
          <form onSubmit={handlePasswordResetVerify}>
            <p style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
              Код отправлен на {resetEmail}
            </p>
            <input
              type="text"
              placeholder="Код из email"
              value={resetCode}
              onChange={e => setResetCode(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Подтвердите новый пароль"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
            />
            <button 
              type="submit" 
              className={styles.button} 
              disabled={loading || newPassword !== confirmPassword || !newPassword || !confirmPassword}
            >
              {loading ? 'Смена пароля...' : 'Сменить пароль'}
            </button>
            
            {/* Показываем ошибку если пароли не совпадают */}
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <div style={{ color: 'red', marginTop: 8, textAlign: 'center', fontSize: '14px' }}>
                Пароли не совпадают
              </div>
            )}
          </form>
        )}
        
        <button 
          onClick={() => {
            setShowPasswordReset(false);
            setResetStep('email');
            setResetEmail('');
            setResetCode('');
            setNewPassword('');
            setConfirmPassword('');
          }} 
          className={styles.switch}
        >
          Вернуться к входу
        </button>
        
        {error && <div style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{error}</div>}
      </div>
    );
  }

  if (showAdminPassword) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Доступ администратора</h2>
        <p style={{ color: '#00e0d3', textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>
          Введите пароль администратора для регистрации менеджера
        </p>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (adminPassword === 'AAAoffice2025') { // Замените на ваш пароль
            setShowManagerRegistration(true);
            setShowAdminPassword(false);
            setAdminPassword('');
          } else {
            setError('Неверный пароль администратора');
          }
        }}>
          <input
            type="password"
            placeholder="Пароль администратора"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Подтвердить
          </button>
        </form>
        <button onClick={() => {
          setShowAdminPassword(false);
          setAdminPassword('');
          setError('');
        }} className={styles.switch}>
          Вернуться к входу
        </button>
        {error && <div style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{error}</div>}
      </div>
    );
  }

  if (showManagerRegistration) {
    return (
      <ManagerRegistrationPage 
        onBack={() => setShowManagerRegistration(false)} 
      />
    );
  }

  // Рендер разных шагов
  if (step === 'email') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Вход в систему</h2>
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Введите ваш email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Поиск...' : 'Продолжить'}
          </button>
        </form>
        {isManagerRegistrationEnabled() && (
          <button 
            onClick={() => setShowAdminPassword(true)} 
            className={styles.switch}
            style={{ marginTop: '8px' }}
          >
            Регистрация пользователей (только для администраторов)
          </button>
        )}
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    );
  }

  if (step === 'companies') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Выберите компанию</h2>
        <p style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
          Найдено {userCompanies.length} компаний для {email}
        </p>
        <div className={styles.companiesList}>
          {userCompanies.map((company, index) => (
            <button
              key={index}
              onClick={() => handleCompanySelect(company.companyName)}
              className={styles.companyButton}
            >
              <div className={styles.companyName}>{company.companyName}</div>
              <div className={styles.companyRole}>
                Роль: {company.role === 'admin' ? 'Администратор' : 
                       company.role === 'manager' ? 'Менеджер' : 'Сотрудник'}
              </div>
            </button>
          ))}
        </div>
        <button onClick={goBack} className={styles.switch}>
          Назад
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Введите пароль</h2>
        <p style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
          Компания: {selectedCompany}
        </p>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        {/* Кнопка "Забыли пароль?" */}
        <button 
          onClick={() => {
            setShowPasswordReset(true);
            setResetEmail(email);
          }} 
          className={styles.switch}
          style={{ marginTop: '10px', fontSize: '14px' }}
        >
          Забыли пароль?
        </button>
        
        <button onClick={goBack} className={styles.switch}>
          Назад
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    );
  }

  if (step === '2fa') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Подтверждение входа</h2>
        <p style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
          Код отправлен на {email}
        </p>
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
        
        {/* Кнопка "Забыли пароль?" */}
        <button 
          onClick={() => {
            setShowPasswordReset(true);
            setResetEmail(email);
          }} 
          className={styles.switch}
          style={{ marginTop: '10px', fontSize: '14px', marginBottom: '40px' }}
        >
          Забыли пароль?
        </button>
        
        <button onClick={goBack} className={styles.switch}>
          Назад
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    );
  }


};

export default LoginPage; 