const API_URL = 'https://logos-backend-production.up.railway.app/api';

export async function register(data) {
  if (data.avatar) {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('role', data.role);
    if (data.companyName) {
      formData.append('companyName', data.companyName);
    }
    formData.append('avatar', data.avatar);
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Ошибка регистрации');
    return res.json();
  } else {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Ошибка регистрации');
    return res.json();
  }
}

// New login flow: first find user companies by email
export async function findUserCompanies(email) {
  console.log('Finding companies for email:', email);
  
  const res = await fetch(`${API_URL}/auth/find-user-companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  console.log('Response status:', res.status);
  
  if (!res.ok) {
    const errorData = await res.json();
    console.log('Error response:', errorData);
    throw new Error(errorData.message || 'Ошибка поиска пользователя');
  }
  
  const data = await res.json();
  console.log('Found companies:', data);
  return data;
}

export async function login(email, password, companyName = null) {
  console.log('API login called with:', { email, password: password ? '***' : 'empty', companyName });
  
  const requestBody = { email, password, companyName };
  console.log('Request body:', requestBody);
  
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  
  console.log('Response status:', res.status);
  
  if (!res.ok) {
    const errorData = await res.json();
    console.log('Error response:', errorData);
    throw new Error(errorData.message || 'Ошибка входа');
  }
  return res.json();
}

export async function verify2fa(email, code) {
  const res = await fetch(`${API_URL}/auth/verify-2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Ошибка верификации');
  return res.json();
}

export function getToken() {
  return localStorage.getItem('token');
}

export function logout() {
  localStorage.clear(); // Полная очистка localStorage
}

export async function getProfile() {
  const token = getToken();
  console.log('getProfile - token:', token ? token.substring(0, 20) + '...' : 'null');
  if (!token) {
    throw new Error('Токен не найден. Пожалуйста, войдите в систему.');
  }
  const res = await fetch(`${API_URL}/user/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.clear();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }
    throw new Error('Ошибка загрузки профиля');
  }
  return res.json();
}

export async function changePassword(currentPassword, newPassword) {
  const token = getToken();
  const res = await fetch(`${API_URL}/user/password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  if (!res.ok) throw new Error('Ошибка смены пароля');
  return res.json();
}

export async function setNewPassword(newPassword) {
  const token = getToken();
  const res = await fetch(`${API_URL}/user/set-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ newPassword })
  });
  if (!res.ok) throw new Error('Ошибка установки пароля');
  return res.json();
}

export async function uploadAvatar(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await fetch(`${API_URL}/user/avatar`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error('Ошибка загрузки аватара');
  const data = await res.json();
  return data.avatarUrl;
}

export async function deleteAccount() {
  const token = getToken();
  const res = await fetch(`${API_URL}/user/delete`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка удаления аккаунта');
  return res.json();
}

export async function getEmployeeStats() {
  const token = getToken();
  if (!token) {
    throw new Error('Токен не найден. Пожалуйста, войдите в систему.');
  }
  const res = await fetch(`${API_URL}/user/employee-stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.clear();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }
    throw new Error('Ошибка загрузки аналитики сотрудников');
  }
  return res.json();
}

export async function getEmployeeDetailed(employeeId) {
  const token = getToken();
  if (!token) {
    throw new Error('Токен не найден. Пожалуйста, войдите в систему.');
  }
  const res = await fetch(`${API_URL}/user/employee-detailed/${employeeId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.clear();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }
    throw new Error('Ошибка загрузки детальной статистики сотрудника');
  }
  return res.json();
}

export async function updateEmployeeStats(id, data) {
  const token = getToken();
  const res = await fetch(`${API_URL}/user/employee-stats/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Ошибка обновления показателей');
  return res.json();
}

export async function getReports() {
  const token = getToken();
  const res = await fetch(`${API_URL}/reports`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки отчётов');
  return res.json();
}

export async function uploadReport({ title, report_date, file }) {
  const token = getToken();
  const formData = new FormData();
  formData.append('title', title);
  formData.append('report_date', report_date);
  formData.append('report', file);
  const res = await fetch(`${API_URL}/reports/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error('Ошибка загрузки отчёта');
  return res.json();
}

// Company Database Management (Admin only)
export async function getAllCompanies() {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-database/list`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки списка компаний');
  return res.json();
}

export async function createCompany(companyName) {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-database/create`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ company_name: companyName })
  });
  if (!res.ok) throw new Error('Ошибка создания компании');
  return res.json();
}

export async function checkCompanyExists(companyName) {
  const res = await fetch(`${API_URL}/company-database/${encodeURIComponent(companyName)}/exists`);
  if (!res.ok) throw new Error('Ошибка проверки компании');
  return res.json();
}

export async function deleteCompany(companyName) {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-database/${encodeURIComponent(companyName)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка удаления компании');
  return res.json();
}

export async function uploadScriptFile(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Upload file error:', res.status, errorData);
    throw new Error(`Ошибка загрузки файла: ${errorData.message || res.statusText}`);
  }
  return res.json();
}

export async function getUploadedFiles() {
  const token = getToken();
  console.log('Getting uploaded files with token:', token ? 'present' : 'missing');
  const res = await fetch(`${API_URL}/upload/list`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Upload files error:', res.status, errorData);
    throw new Error(`Ошибка получения списка файлов: ${errorData.message || res.statusText}`);
  }
  return res.json();
}

export async function deleteUploadedFile(id) {
  const token = getToken();
  const res = await fetch(`${API_URL}/upload/${id}`, { 
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка удаления файла');
  return res.json();
}

// Company Data Access (Company-specific data)
export async function getCompanyOverview() {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-data/overview`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки обзора компании');
  return res.json();
}

export async function getCompanyUsers() {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-data/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки пользователей компании');
  return res.json();
}

export async function getCompanyManagers() {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-data/managers`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки менеджеров');
  return res.json();
}

export async function getCompanyEmployees() {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-data/employees`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки сотрудников');
  return res.json();
}

export async function getCompanyEmployeeStats() {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-data/employee-stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки статистики сотрудников');
  return res.json();
}

export async function getCompanyTasks() {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-data/tasks`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки задач');
  return res.json();
}

export async function getCompanyDialogues() {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-data/dialogues`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки диалогов');
  return res.json();
}

export async function getCompanyReports() {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-data/reports`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки отчетов');
  return res.json();
}

export async function getCompanyFiles() {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-data/files`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки файлов');
  return res.json();
}

export async function getCompanyActivity(period = 30) {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-data/activity?period=${period}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки активности');
  return res.json();
}

export async function getCompanyStats() {
  const token = getToken();
  const res = await fetch(`${API_URL}/company-data/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка загрузки статистики');
  return res.json();
}

// Получить список всех компаний (публичный endpoint)
export async function getCompaniesList() {
  const res = await fetch(`${API_URL}/companies`);
  if (!res.ok) throw new Error('Ошибка загрузки списка компаний');
  return res.json();
}

// Get user companies by email
export async function getUserCompanies(email) {
  const res = await fetch(`${API_URL}/auth/user-companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  if (!res.ok) {
    throw new Error('Ошибка получения списка компаний');
  }
  
  return res.json();
}

// Analytics API
export async function getDepartmentAnalytics() {
  const token = getToken();
  const res = await fetch(`${API_URL}/analytics/department`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка получения аналитики отдела');
  return res.json();
}

export async function saveDepartmentAnalytics(data) {
  const token = getToken();
  const res = await fetch(`${API_URL}/analytics/department`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Ошибка сохранения данных аналитики');
  return res.json();
}

// Call Quality Analytics API
export async function getCallQualityAnalytics() {
  const token = getToken();
  const res = await fetch(`${API_URL}/analytics/call-quality`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ошибка получения аналитики качества звонков');
  return res.json();
}

export async function saveCallQualityData(data) {
  const token = getToken();
  const res = await fetch(`${API_URL}/analytics/call-quality`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Ошибка сохранения данных качества звонка');
  return res.json();   
}

// Password Reset Functions
export async function requestPasswordReset(email) {
  const res = await fetch(`${API_URL}/auth/request-password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error('Ошибка запроса сброса пароля');
  return res.json();
}

export async function verifyPasswordReset(email, code, newPassword) {
  const res = await fetch(`${API_URL}/auth/verify-password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword })
  });
  if (!res.ok) throw new Error('Ошибка верификации сброса пароля');
  return res.json();
}

// Получение звонков сотрудника
export async function getEmployeeCalls() {
  const token = getToken();
  if (!token) {
    throw new Error('Токен не найден. Пожалуйста, войдите в систему.');
  }

  const res = await fetch(`${API_URL}/employee/calls`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error('API Error Response:', errorData);
    throw new Error(errorData.error || errorData.message || 'Ошибка загрузки звонков');
  }

  return res.json();
}

// Получение деталей звонка
export async function getCallDetails(callId) {
  const token = getToken();
  if (!token) {
    throw new Error('Токен не найден. Пожалуйста, войдите в систему.');
  }

  const res = await fetch(`${API_URL}/employee/calls/${callId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error('API Error Response:', errorData);
    throw new Error(errorData.error || errorData.message || 'Ошибка загрузки деталей звонка');
  }

  return res.json();
}

// Получение URL для скачивания аудио файла звонка
export function getCallAudioUrl(callId, audioUrl) {
  if (!audioUrl) {
    return null;
  }
  
  // Если URL уже полный (начинается с http), возвращаем как есть
  if (audioUrl.startsWith('http')) {
    return audioUrl;
  }
  
  // Иначе добавляем базовый URL
  return `https://logos-backend-production.up.railway.app${audioUrl}`;
}

// Скачивание аудио файла звонка
export async function downloadCallAudio(callId, audioUrl) {
  const token = getToken();
  if (!token) {
    throw new Error('Токен не найден. Пожалуйста, войдите в систему.');
  }

  const fullUrl = getCallAudioUrl(callId, audioUrl);
  if (!fullUrl) {
    throw new Error('URL аудио файла не найден');
  }

  const res = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Ошибка скачивания аудио файла');
  }

  // Создаем blob и скачиваем файл
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `call_${callId}_audio${getFileExtension(audioUrl)}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Вспомогательная функция для получения расширения файла
function getFileExtension(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return ext ? `.${ext}` : '.wav';
}