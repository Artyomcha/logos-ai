import React, { useState, useEffect, useCallback } from 'react';
import { getEmployeeDetailed } from '../services/api';
import styles from '../styles/EmployeeDetailPage.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from 'chart.js';
import { Bar, Radar, Line, Doughnut, Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

// Функция для определения класса рейтинга
function getRankingClass(rating) {
  if (rating >= 8) return styles.ratingGreen;
  if (rating >= 7) return styles.ratingOrange;
  return styles.ratingRed;
}

const EmployeeDetailPage = ({ employeeId, onBack }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEmployeeData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEmployeeDetailed(employeeId);
      console.log('Employee data received:', data);
      setEmployeeData(data);
    } catch (err) {
      console.error('Error loading employee data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    loadEmployeeData();
  }, [employeeId, loadEmployeeData]);

  if (loading) return <div className={styles.loading}>Загрузка данных сотрудника...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;
  if (!employeeData) return <div>Данные не найдены</div>;
  
  // Проверяем что Chart.js зарегистрирован
  if (!ChartJS.registry) {
    console.error('Chart.js not properly registered');
    return <div className={styles.error}>Ошибка инициализации графиков</div>;
  }

  const { employee, weeklyTrend, monthlyTrend, qualityMetrics } = employeeData;
  
  console.log('Rendering with data:', { employee, weeklyTrend, monthlyTrend, qualityMetrics });

  // Данные для графика 1: Динамика длительности звонков с трендом
  const callDurationData = {
    labels: weeklyTrend.length > 0 ? weeklyTrend.map(item => new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })) : ['Нет данных'],
    datasets: [
      {
        label: 'Тренд',
        data: weeklyTrend.length > 0 ? weeklyTrend.map(item => item.avg_call_duration_minutes) : [0],
        borderColor: '#1C85FF',
        backgroundColor: '#1C85FF',
        borderWidth: 2,
        pointBackgroundColor: '#1C85FF',
        pointBorderColor: '#1C85FF',
        pointRadius: 6,
        pointHoverRadius: 12,
        type: 'line',
        fill: false,
        tension: 0,
        yAxisID: 'y',
        order: 1,
      },
      {
        label: 'Средняя длительность (мин)',
        data: weeklyTrend.length > 0 ? weeklyTrend.map(item => item.avg_call_duration_minutes) : [0],
        backgroundColor: '#0ED365',
        borderColor: '#0ED365',
        borderWidth: 0,
        type: 'bar',
        barThickness: 30,
        order: 2,
      },
    ],
  };

         // Данные для графика 2: Профиль звонков (Radar Chart)
       const radarData = {
         labels: ['Длительность', 'Скрипт', 'Фразы', 'Этапы', 'Успех'],
         datasets: [
           {
             label: 'Текущие показатели',
             data: [
               Math.min((qualityMetrics.avgCallDuration || 0) * 10, 100), // Масштабируем до 0-100
               qualityMetrics.scriptCompliance || 0,
               qualityMetrics.keyPhrasesUsed || 0,
               qualityMetrics.stagesCompleted || 0,
               qualityMetrics.successRate || 0,
             ],
             backgroundColor: 'rgba(255, 99, 132, 0.2)',
             borderColor: '#7B11F0',
             borderWidth: 1,
             pointBackgroundColor: '#7B11F0',
             pointBorderColor: '#fff',
             pointHoverBackgroundColor: '#fff',
             pointHoverBorderColor: '#7B11F0',
           },
         ],
       };

  // Данные для графика 3: Кольцевая диаграмма успешности звонков
  const successRateData = {
    labels: ['Успешные', 'Неуспешные'],
    datasets: [
      {
        data: [
          employee.success_rate_percentage || 0,
          100 - (employee.success_rate_percentage || 0)
        ],
        backgroundColor: [
          '#FFDD03',
          '#F4037A',
        ],
        borderColor: [
          '#FFDD03',
          '#F4037A',
        ],
        borderWidth: 5,
      },
    ],
  };

  const callDurationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#1C85FF',
        borderWidth: 1,
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 6,
        hoverRadius: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: '#fff',
          font: {
            size: 11,
            weight: 'bold',
          },
          padding: 15,
        },
        ticks: {
          color: '#fff',
          backdropColor: 'transparent',
          stepSize: 20,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff',
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 10,
        },
      },
    },
  };

  console.log('Chart data prepared:', { callDurationData, radarData, successRateData });

  return (
    <div className={styles.employeeDetailPage}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Назад к списку
        </button>
        <h1 className={styles.title}>Детальная статистика сотрудника</h1>
      </div>

      {/* Информация о сотруднике */}
      <div className={styles.employeeInfo}>
        <img
          src={employee.avatar_url ? `https://logos-backend-production.up.railway.app${employee.avatar_url}` : '/default-avatar.png'}
          alt={employee.first_name + ' ' + employee.last_name}
          className={styles.employeeAvatar}
        />
        <div className={styles.employeeDetails}>
          <h2 className={styles.employeeName}>{employee.first_name} {employee.last_name}</h2>
          <p className={styles.employeeEmail}>{employee.email}</p>
        </div>
      </div>

      {/* Обзор статистики */}
      <div className={styles.statsOverview}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{employee.calls || 0}</div>
          <div className={styles.statLabel}>Всего звонков</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{employee.deals || 0}</div>
          <div className={styles.statLabel}>Сделки</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statNumber} ${getRankingClass(employee.rating || 0)}`}>
            {employee.rating ? employee.rating.toString().replace('.', ',') : '0'}
          </div>
          <div className={styles.statLabel}>Рейтинг</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{employee.success_rate_percentage || 0}%</div>
          <div className={styles.statLabel}>% успеха</div>
        </div>
      </div>

      {/* Графики */}
      <div className={styles.chartsGrid}>
        {/* График 1: Динамика длительности звонков */}
        <div className={styles.chartCard}>
          <h3>Динамика длительности звонков</h3>
          <div className={`${styles.chartContainer} ${styles.tall}`}>
            <Chart data={callDurationData} options={callDurationOptions} />
          </div>
          <div className={styles.chartInfo}>
            <p>Последние 7 дней</p>
            <p>Средняя: {employee.avg_call_duration_minutes || 0} мин</p>
          </div>
        </div>

        {/* График 2: Профиль звонков */}
        <div className={styles.chartCard}>
          <h3>Профиль звонков</h3>
          <div className={`${styles.chartContainer} ${styles.radarChartContainer}`}>
            <Radar data={radarData} options={radarOptions} className={styles.radar}/>
          </div>
          <div className={styles.chartInfo}>
            <p>Средняя длина: {employee.avg_call_duration_minutes || 0} мин</p>
            <p>% отклонений: {100 - (employee.script_compliance_percentage || 0)}%</p>
          </div>
        </div>

        {/* График 3: Успешность звонков */}
        <div className={styles.chartCard}>
          <h3>Успешность звонков</h3>
          <div className={`${styles.chartContainer} ${styles.dChartContainer}`}>
            <Doughnut data={successRateData} options={doughnutOptions} className={styles.doughnut}/>
          </div>
          <div className={styles.chartInfo}>
            <p>Успешных: {Math.round((employee.success_rate_percentage || 0) * (employee.calls || 0) / 100)}</p>
            <p>Всего: {employee.calls || 0}</p>
            <p>Процент успеха: {employee.success_rate_percentage || 0}%</p>
          </div>
        </div>
      </div>

      {/* Детальная статистика */}
      <div className={styles.detailedStats}>
        <h3>Детальная статистика</h3>
        <div className={styles.statsGrid}>
          <div className={styles.detailStat}>
            <span className={styles.detailLabel}>Средняя длительность звонка:</span>
            <span className={styles.detailValue}>{employee.avg_call_duration_minutes || 0} мин</span>
          </div>
          <div className={styles.detailStat}>
            <span className={styles.detailLabel}>Соблюдение скрипта:</span>
            <span className={styles.detailValue}>{employee.script_compliance_percentage || 0}%</span>
          </div>
          <div className={styles.detailStat}>
            <span className={styles.detailLabel}>Ключевые фразы:</span>
            <span className={styles.detailValue}>{employee.key_phrases_used || 0}</span>
          </div>
          <div className={styles.detailStat}>
            <span className={styles.detailLabel}>Запрещенные фразы:</span>
            <span className={styles.detailValue}>{employee.forbidden_phrases_count || 0}</span>
          </div>
          <div className={styles.detailStat}>
            <span className={styles.detailLabel}>Этапы выполнены:</span>
            <span className={styles.detailValue}>{employee.stages_completed || 0}/{employee.total_stages || 0}</span>
          </div>

          <div className={styles.detailStat}>
            <span className={styles.detailLabel}>Процент успеха:</span>
            <span className={styles.detailValue}>{employee.success_rate_percentage || 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage; 