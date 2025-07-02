import styles from './Hero.module.css';

import jethalalBanner from '../../assets/jethalalBanner.png';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../../hooks';

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <section className='white-bcg'>
      <div className={`container ${styles.hero}`}>
        <article className={styles.content}>
          <h1>Transformando ideas en experiencias digitales interactivas y fluidas con tecnología de vanguardia.</h1>

          <p>
            ¡Bienvenido a Yero Shop! Experimenta la alegría de las compras en línea sin problemas y explora el mundo de de una forma diferente con nosotros. Comienza a navegar por nuestra vasta colección hoy y eleva tu estilo de vida digital con nuestros productos y servicios excepcionales.
          </p>

          <Link to='/products' className={`btn ${styles.btnHero}`}>
            Comprar ahora
          </Link>
        </article>

        {!isMobile && (
          <article className={styles.imageContainer}>
            <img
              src={jethalalBanner}
              alt="jethalal"
              className={styles.banner}
            />
          </article>
        )}
      </div>
    </section>
  );
};

export default Hero;