import React, { useState, useEffect } from 'react';
import { getCallDetails, getCallAudioUrl, downloadCallAudio } from '../services/api';
import styles from '../styles/CallDetailsPage.module.css';

const CallDetailsPage = ({ callId, onBack }) => {
  const [callDetails, setCallDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioDuration, setAudioDuration] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchCallDetails = async () => {
      try {
        setLoading(true);
        console.log('CallDetailsPage - fetching details for callId:', callId);
        const data = await getCallDetails(callId);
        console.log('CallDetailsPage - received data:', data);
        setCallDetails(data);
        
        // Устанавливаем URL аудио если он есть
        if (data.audio_url) {
          setAudioUrl(data.audio_url);
          // Получаем длину аудио
          await getAudioDuration(data.audio_url);
        }
      } catch (err) {
        console.error('CallDetailsPage - Error fetching call details:', err);
        setError('Ошибка загрузки деталей звонка: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (callId) {
      fetchCallDetails();
    }
  }, [callId]);

  // Обработчик окончания воспроизведения аудио
  useEffect(() => {
    if (window.audioPlayer) {
      const handleEnded = () => {
        setIsPlaying(false);
      };
      
      window.audioPlayer.addEventListener('ended', handleEnded);
      
      return () => {
        window.audioPlayer.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  // Функция для получения длительности аудио
  const getAudioDuration = async (url) => {
    try {
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        const duration = Math.floor(audio.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        setAudioDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      });
      audio.addEventListener('error', () => {
        setAudioDuration('0:00');
      });
    } catch (error) {
      console.error('Error getting audio duration:', error);
      setAudioDuration('0:00');
    }
  };

  const getScoreColor = (score) => {
    if (!score || score === '-') return '';
    const numScore = parseFloat(score);
    if (numScore >= 80) return styles.scoreGreen;
    if (numScore >= 50) return styles.scoreOrange;
    return styles.scoreRed;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Функции для работы с аудио
  const handlePlayAudio = () => {
    if (!callDetails.audio_url) {
      alert('Аудио файл для этого звонка не найден');
      return;
    }

    if (!window.audioPlayer) {
      window.audioPlayer = new Audio();
    }

    if (isPlaying) {
      window.audioPlayer.pause();
      setIsPlaying(false);
    } else {
      window.audioPlayer.src = callDetails.audio_url;
      window.audioPlayer.play();
      setIsPlaying(true);
    }
  };

  const handleDownloadAudio = async () => {
    if (!callDetails.audio_url) {
      alert('Аудио файл для этого звонка не найден');
      return;
    }

    try {
      await downloadCallAudio(callId, callDetails.audio_url);
    } catch (error) {
      console.error('Error downloading audio:', error);
      alert('Ошибка при скачивании аудио файла: ' + error.message);
    }
  };

  // Функция для переключения полноэкранного режима
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };


  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Загрузка деталей звонка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    );
  }

  if (!callDetails) {
    return (
      <div className={styles.error}>
        <p>Детали звонка не найдены</p>
      </div>
    );
  }

  // Если включен полноэкранный режим для транскрипта
  if (isFullscreen) {
    return (
      <div className={styles.fullscreenOverlay}>
        <div className={styles.fullscreenHeader}>
          <h2>Текст звонка - Полный экран</h2>
          <button 
            className={styles.fullscreenCloseButton}
            onClick={toggleFullscreen}
          >
            ✕ Закрыть
          </button>
        </div>
        <div className={styles.fullscreenContent}>
          {callDetails.transcript ? (
            <div className={styles.fullscreenTranscript}>
              {callDetails.transcript.map((message, index) => (
                <div key={index} className={styles.fullscreenMessage}>
                  {message.speaker === 'dialogue' ? (
                    <div className={styles.fullscreenDialogue}>
                      <div className={styles.fullscreenDialogueTitle}>Полный диалог:</div>
                      <div className={styles.fullscreenDialogueText}>
                        {message.text}
                      </div>
                    </div>
                  ) : (
                    <div className={`${styles.fullscreenMessageContainer} ${styles[`fullscreen${message.speaker.charAt(0).toUpperCase() + message.speaker.slice(1)}`]}`}>
                      <div className={styles.fullscreenSpeaker}>
                        {message.speaker === 'employee' ? 'Специалист' : 'Клиент'}
                      </div>
                      <div className={styles.fullscreenMessageText}>
                        {message.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.fullscreenNoTranscript}>
              <p>Транскрипт звонка недоступен</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.callDetailsWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Подробнее о звонке</h1>
        <button 
          className={styles.backButton}
          onClick={onBack}
        >
          Назад
        </button>
      </div>

      <div className={styles.infoCards}>
        <div className={styles.infoCard}>
          <div className={styles.cardLabel}>Время / дата</div>
          <div className={styles.cardValue}>
            <div>{formatTime(callDetails.recorded_at)}</div>
            <div>{formatDate(callDetails.recorded_at)}</div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardLabel}>Клиент</div>
          <div className={styles.cardValue}>
            {callDetails.customer_name || 'Не указан'}
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardLabel}>Рейтинг</div>
          <div className={`${styles.cardValue} ${getScoreColor(callDetails.overall_score)}`}>
            {callDetails.overall_score || '-'}
          </div>
        </div>
      </div>

      <div className={styles.recordingSection}>
        <div className={styles.recordingHeader}>
          <span>Запись звонка</span>
          <div className={styles.recordingControls}>
            {callDetails.audio_url ? (
              <>
                <span className={styles.duration}>{audioDuration || '0:00'}</span>
                <button 
                  className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
                  onClick={handlePlayAudio}
                  title="Воспроизвести аудио"
                >
                  <span className={styles.playIcon}>
                    {isPlaying ? '⏸' : '▶'}
                  </span>
                </button>
                <button 
                  className={styles.downloadButton}
                  onClick={handleDownloadAudio}
                  title="Скачать аудио"
                >
                  <span className={styles.downloadIcon}>⬇</span>
                </button>
              </>
            ) : (
              <span className={styles.noAudio}>Аудио файл недоступен</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.transcriptSection}>
        <div className={styles.transcriptHeader}>
          <h2 className={styles.transcriptTitle}>Текст звонка</h2>
          <button 
            className={styles.fullscreenButton}
            onClick={toggleFullscreen}
            title="Открыть в полный экран"
          >
            ⛶ Полный текст
          </button>
        </div>
        <div className={styles.transcriptBox}>
          {callDetails.transcript ? (
            <div className={styles.transcriptContent}>
                                {callDetails.transcript.map((message, index) => (
                    <div key={index} className={styles.message}>
                      {message.speaker === 'dialogue' ? (
                        <div className={styles.fullDialogue}>
                          <div className={styles.dialogueTitle}>Полный диалог:</div>
                          <div className={styles.dialogueText}>
                            {message.text}
                          </div>
                        </div>
                      ) : (
                        <div className={`${styles.messageContainer} ${styles[message.speaker]}`}>
                          <div className={styles.speaker}>
                            {message.speaker === 'employee' ? 'Специалист' : 'Клиент'}
                          </div>
                          <div className={styles.messageText}>
                            {message.text}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          ) : (
            <div className={styles.noTranscript}>
              <p>Транскрипт звонка недоступен</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallDetailsPage;
