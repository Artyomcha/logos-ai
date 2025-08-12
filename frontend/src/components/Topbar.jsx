import styles from '../styles/Topbar.module.css';
import logoImg from '../assets/logo-logosai.png';

export default function Topbar({ profile, onProfileClick, role }) {
  console.log('Topbar render - profile:', profile);
  console.log('Topbar render - avatarUrl:', profile?.avatarUrl);
  
  // Определяем должность в зависимости от роли
  const getRoleTitle = () => {
    switch (role) {
      case 'employee':
        return 'Сотрудник отдела продаж';
      case 'manager':
        return 'Руководитель отдела продаж';
      case 'admin':
        return 'Администратор';
      default:
        return 'Руководитель отдела продаж';
    }
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.profileInfo} onClick={onProfileClick}>
        <img
          src={profile?.avatarUrl ? `https://logos-backend-production.up.railway.app${profile.avatarUrl}` : '/default-avatar.png'}
          alt="avatar"
          className={styles.avatar}
        />
        <div>
          <div className={styles.name}>{profile?.lastName} {profile?.firstName}</div>
          <div className={styles.role}>{getRoleTitle()}</div>
        </div>
      </div>
      <img src={logoImg} alt="Logos AI" className={styles.logo} />
    </header>
  );
}