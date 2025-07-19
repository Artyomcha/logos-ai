import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import './global.css';

function App() {
  const [role, setRole] = useState(null); // 'employee' | 'manager'

  if (!role) {
    return <LoginPage onLogin={setRole} />;
  }

  return <Dashboard role={role} onLogout={() => setRole(null)} />;
}

export default App;
