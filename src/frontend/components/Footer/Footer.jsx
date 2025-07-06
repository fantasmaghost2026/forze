import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Footer.module.css';
import JethaBg from '../../assets/jetha-bg.mp3';
import useAudio from '../../hooks/useAudio';

// Iconos disponibles - mapeo dinámico con símbolos modernos
const IconComponents = {
  AiOutlineTwitter: () => (
    <div className={styles.modernIcon} data-social="twitter">
      <span className={styles.iconSymbol}>𝕏</span>
    </div>
  ),
  AiFillLinkedin: () => (
    <div className={styles.modernIcon} data-social="linkedin">
      <span className={styles.iconSymbol}>in</span>
    </div>
  ),
  AiFillGithub: () => (
    <div className={styles.modernIcon} data-social="github">
      <span className={styles.iconSymbol}>⚡</span>
    </div>
  ),
  AiFillFacebook: () => (
    <div className={styles.modernIcon} data-social="facebook">
      <span className={styles.iconSymbol}>f</span>
    </div>
  ),
  AiFillInstagram: () => (
    <div className={styles.modernIcon} data-social="instagram">
      <span className={styles.iconSymbol}>📷</span>
    </div>
  ),
  AiFillYoutube: () => (
    <div className={styles.modernIcon} data-social="youtube">
      <span className={styles.iconSymbol}>▶</span>
    </div>
  ),
  AiOutlineWhatsApp: () => (
    <div className={styles.modernIcon} data-social="whatsapp">
      <span className={styles.iconSymbol}>💬</span>
    </div>
  ),
  AiOutlineMail: () => (
    <div className={styles.modernIcon} data-social="email">
      <span className={styles.iconSymbol}>@</span>
    </div>
  ),
  AiOutlinePhone: () => (
    <div className={styles.modernIcon} data-social="phone">
      <span className={styles.iconSymbol}>📞</span>
    </div>
  ),
  AiOutlineGlobal: () => (
    <div className={styles.modernIcon} data-social="website">
      <span className={styles.iconSymbol}>🌐</span>
    </div>
  )
};

const Footer = () => {
  const presentYear = new Date().getFullYear();
  const handleSoundPausePlay = useAudio({ audioTrack: JethaBg });
  const [footerLinks, setFooterLinks] = useState([]);

  // Cargar footer links desde localStorage o usar los por defecto
  useEffect(() => {
    const loadFooterLinks = () => {
      const savedConfig = localStorage.getItem('adminStoreConfig');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          if (parsedConfig.footerLinks && parsedConfig.footerLinks.length > 0) {
            setFooterLinks(parsedConfig.footerLinks);
            return;
          }
        } catch (error) {
          console.error('Error al cargar footer links:', error);
        }
      }
      
      // Links por defecto si no hay configuración
      const defaultLinks = [
        {
          id: 1,
          icon: 'AiOutlineTwitter',
          url: 'https://twitter.com/Swastik2001',
          label: 'Twitter'
        },
        {
          id: 2,
          icon: 'AiFillLinkedin',
          url: 'https://www.linkedin.com/in/swastik-patro-2a54bb19b/',
          label: 'LinkedIn'
        },
        {
          id: 3,
          icon: 'AiFillGithub',
          url: 'https://github.com/swastikpatro',
          label: 'GitHub'
        }
      ];
      setFooterLinks(defaultLinks);
    };

    loadFooterLinks();

    // Escuchar eventos de actualización de footer links
    const handleFooterLinksUpdate = (event) => {
      const { footerLinks: updatedLinks } = event.detail;
      console.log('📡 Footer Links actualizados en tiempo real:', updatedLinks.length);
      setFooterLinks(updatedLinks);
    };

    const handleConfigUpdate = () => {
      console.log('📡 Configuración actualizada, recargando footer links...');
      loadFooterLinks();
    };

    // Agregar listeners
    window.addEventListener('footerLinksUpdated', handleFooterLinksUpdate);
    window.addEventListener('forceStoreUpdate', handleConfigUpdate);
    window.addEventListener('adminConfigChanged', handleConfigUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('footerLinksUpdated', handleFooterLinksUpdate);
      window.removeEventListener('forceStoreUpdate', handleConfigUpdate);
      window.removeEventListener('adminConfigChanged', handleConfigUpdate);
    };
  }, []);

  const renderIcon = (iconName) => {
    const IconComponent = IconComponents[iconName];
    return IconComponent ? IconComponent() : (
      <div className={styles.modernIcon} data-social="default">
        <span className={styles.iconSymbol}>🔗</span>
      </div>
    );
  };

  return (
    <section className={styles.footer}>
      <div className={styles.linksContainer}>
        {footerLinks.map((singleLink) => (
          <Link 
            key={singleLink.id} 
            to={singleLink.url} 
            target='_blank'
            title={singleLink.label}
            className={styles.footerLink}
          >
            {renderIcon(singleLink.icon)}
            <span className={styles.linkLabel}>
              {singleLink.label}
            </span>
          </Link>
        ))}
      </div>

      <div className={styles.copyrightDiv}>
        <span>© {presentYear} </span>
        <div className={styles.jethaDiv}>
          <button onClick={handleSoundPausePlay} className={styles.nameBtn}>
            Yero Shop!.
          </button>{' '}
          <div className={styles.tooltip}>⚠ Includes Music !!</div>
        </div>
        <span>All rights reserved</span>
      </div>
    </section>
  );
};

export default Footer;