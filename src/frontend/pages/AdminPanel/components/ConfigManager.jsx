import React, { useState } from 'react';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import { useConfigContext } from '../../../contexts/ConfigContextProvider';
import styles from './ConfigManager.module.css';

const ConfigManager = () => {
  const { exportConfiguration, importConfiguration, resetConfiguration } = useConfigContext();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      exportConfiguration();
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al exportar la configuración');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);

    try {
      await importConfiguration(file);
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al importar la configuración');
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleReset = async () => {
    if (!window.confirm('¿Estás seguro de restablecer toda la configuración a los valores por defecto? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      resetConfiguration();
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al restablecer la configuración');
    }
  };

  return (
    <div className={styles.configManager}>
      <h2>Gestión de Configuración</h2>
      
      <div className={styles.configSection}>
        <div className={styles.configCard}>
          <div className={styles.cardHeader}>
            <h3>📤 Exportar Configuración</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Exporta toda la configuración de la tienda incluyendo productos, 
              cupones, zonas de entrega y configuraciones generales en un archivo JSON.
            </p>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className={`btn btn-primary ${styles.actionButton}`}
            >
              {isExporting ? (
                <span className={styles.loading}>
                  <span className="loader-2"></span>
                  Exportando...
                </span>
              ) : (
                '📤 Exportar Configuración'
              )}
            </button>
          </div>
        </div>

        <div className={styles.configCard}>
          <div className={styles.cardHeader}>
            <h3>📥 Importar Configuración</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Importa una configuración previamente exportada. Esto sobrescribirá 
              toda la configuración actual de la tienda.
            </p>
            <div className={styles.importContainer}>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className={styles.fileInput}
                id="config-import"
              />
              <label 
                htmlFor="config-import" 
                className={`btn btn-success ${styles.actionButton} ${isImporting ? styles.disabled : ''}`}
              >
                {isImporting ? (
                  <span className={styles.loading}>
                    <span className="loader-2"></span>
                    Importando...
                  </span>
                ) : (
                  '📥 Seleccionar Archivo'
                )}
              </label>
            </div>
          </div>
        </div>

        <div className={styles.configCard}>
          <div className={styles.cardHeader}>
            <h3>🔄 Restablecer Configuración</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Restablece toda la configuración de la tienda a los valores por defecto. 
              <strong> Esta acción no se puede deshacer.</strong>
            </p>
            <button 
              onClick={handleReset}
              className={`btn btn-danger ${styles.actionButton}`}
            >
              🔄 Restablecer a Valores por Defecto
            </button>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>ℹ️ Información Importante</h3>
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <strong>Formato del archivo:</strong> JSON (.json)
          </div>
          <div className={styles.infoItem}>
            <strong>Contenido incluido:</strong> Productos, cupones, zonas de entrega, configuración general
          </div>
          <div className={styles.infoItem}>
            <strong>Compatibilidad:</strong> Solo archivos exportados desde esta versión del panel
          </div>
          <div className={styles.infoItem}>
            <strong>Seguridad:</strong> Realiza copias de seguridad antes de importar configuraciones
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigManager;