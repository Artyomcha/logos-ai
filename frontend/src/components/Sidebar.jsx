import styles from '../styles/Sidebar.module.css';

export default function Sidebar({ section, setSection, onLogout, role }) {
  // Для employee показываем только 4 кнопки
  if (role === 'employee') {
    return (
      <nav className={styles.sidebar}>
        <div className={styles.menu}>
          <button className={section === 'main' ? styles.active : ''} onClick={() => setSection('main')}>Главная</button>
          <button className={section === 'calls' ? styles.active : ''} onClick={() => setSection('calls')}>Звонки</button>
          <button className={section === 'training' ? styles.active : ''} onClick={() => setSection('training')}>Обучение</button>
        </div>
        <button className={styles.logout} onClick={onLogout}>Выход</button>
      </nav>
    );
  }

  // Для manager и admin показываем все кнопки
  return (
    <nav className={styles.sidebar}>
      <div className={styles.menu}>
        <button className={section === 'main' ? styles.active : ''} onClick={() => setSection('main')}>Главная</button>
        <button className={section === 'reports' ? styles.active : ''} onClick={() => setSection('reports')}>Отчёты</button>
        <button className={section === 'employees' ? styles.active : ''} onClick={() => setSection('employees')}>Сотрудники</button>
        <button className={section === 'files' ? styles.active : ''} onClick={() => setSection('files')}>Файлы</button>
        <button className={section === 'training' ? styles.active : ''} onClick={() => setSection('training')}>Обучение</button>
      </div>
      <button className={styles.logout} onClick={onLogout}>Выход</button>
    </nav>
  );
}