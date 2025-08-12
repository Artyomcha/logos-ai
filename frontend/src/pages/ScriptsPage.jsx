import React, { useState, useEffect } from "react";
import styles from "../styles/ScriptsPage.module.css";
import { uploadScriptFile, getUploadedFiles, deleteUploadedFile } from "../services/api";


const ScriptsPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    getUploadedFiles().then(setUploadedFiles);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    await uploadScriptFile(file);
    setSelectedFile(null);
    getUploadedFiles().then(setUploadedFiles);
  };

  const handleDelete = async (id) => {
    await deleteUploadedFile(id);
    setUploadedFiles((files) => files.filter((f) => f.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.fixedWindow}>
        <h2 className={styles.title}>Поле для загрузки</h2>
        <form className={styles.uploadForm}>
          <input
            type="file"
            onChange={handleFileChange}
            title="Перетащите или выберите файл"
          />
        </form>
        <p className={styles.description}>
          Перетащите файлы с информацией о вашем товаре/услуге, а также скрипт продаж в поле для загрузки, система автоматически изучит и применит в аналитике.
        </p>
        <h3 className={styles.subtitle}>Загруженные файлы</h3>
        <div className={styles.fileList}>
          {uploadedFiles.map((file) => (
            <div key={file.id} className={styles.fileItem}>
              <span>{file.original_name}</span>
              <div className={styles.iconGroup}>
                <a
                  className={styles.iconBtn}
                  href={`https://logos-backend-production.up.railway.app${file.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Просмотр"
                >
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                    <path
                      fill="#fff"
                      d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"
                    />
                  </svg>
                </a>
                <a
                  className={styles.iconBtn}
                  href={`https://logos-backend-production.up.railway.app${file.file_url}`}
                  download
                  title="Скачать"
                >
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                    <path
                      fill="#fff"
                      d="M12 16a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v10a1 1 0 0 1-1 1zm-4.707-3.707a1 1 0 0 1 1.414 0L12 15.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414zM5 20a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"
                    />
                  </svg>
                </a>
                <button
                  className={styles.iconBtn}
                  onClick={() => handleDelete(file.id)}
                  title="Удалить"
                  type="button"
                >
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                    {/* Крышка с ручкой */}
                    <rect x="7" y="4" width="10" height="3" rx="1.5" stroke="#fff" strokeWidth="2" fill="none"/>
                    {/* Корпус-трапеция */}
                    <path d="M6 7h12l-1.2 11.2A2 2 0 0 1 14.81 20H9.19a2 2 0 0 1-1.99-1.8L6 7Z" stroke="#fff" strokeWidth="2" fill="none"/>
                    {/* Вертикальные линии */}
                    <line x1="10" y1="11" x2="10" y2="17" stroke="#fff" strokeWidth="2"/>
                    <line x1="12" y1="11" x2="12" y2="17" stroke="#fff" strokeWidth="2"/>
                    <line x1="14" y1="11" x2="14" y2="17" stroke="#fff" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScriptsPage; 