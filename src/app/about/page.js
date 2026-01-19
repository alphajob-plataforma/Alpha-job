import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChevronDown, Lightbulb, Award, Shield } from 'lucide-react';
import Link from 'next/link';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className={styles.main}>

        {/* --- HERO SECTION --- */}
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Conectando el mejor talento con las empresas más innovadoras
            </h1>
            <p className={styles.heroText}>
              Redefiniendo la forma en que el mundo trabaja. Una plataforma diseñada para la excelencia, la seguridad y el crecimiento mutuo.
            </p>

            <div className={styles.scrollIndicator}>
              <ChevronDown size={24} />
              <span>Descubre nuestra historia</span>
            </div>
          </div>
        </section>

        {/* --- MISSION SECTION --- */}
        <section className={styles.missionSection}>
          <div className={styles.gridContainer}>
            <div>
              <div className={styles.sectionBar}></div>
              <h2 className={styles.sectionHeading}>Nuestra Misión</h2>
              <div className={styles.textBlock}>
                <p>
                  En <strong>ChambexCity</strong>, creemos que el talento no tiene fronteras. Nuestra misión es empoderar a los profesionales independientes brindándoles las herramientas y la seguridad necesarias para llevar sus carreras al siguiente nivel.
                </p>
                <p>
                  Al mismo tiempo, ayudamos a las empresas más visionarias a escalar sus proyectos conectándolas con expertos verificados en tiempo récord. No somos solo un marketplace; somos el motor de la revolución del trabajo digital.
                </p>
              </div>
            </div>

            <div className={styles.imageWrapper}>
              <div className={styles.imageGlow}></div>
              {/* Placeholder para imagen de equipo */}
              <div className={styles.missionImage} style={{ backgroundImage: 'url("/Presentación Conozca a Nuestro Equipo Moderno Negro.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                
              </div>
            </div>
          </div>
        </section>

        {/* --- WHY CHOOSE US --- */}
        <section className={styles.whySection}>
          <div className={styles.centeredHeader}>
            <h2 className={styles.sectionHeading} style={{ marginBottom: '1rem' }}>Por qué elegirnos</h2>
            <p className={styles.heroText} style={{ fontSize: '1.125rem' }}>
              Los pilares que sostienen nuestra comunidad y garantizan el éxito de cada colaboración.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <Lightbulb size={36} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>Innovación</h3>
              <p className={styles.heroText} style={{ fontSize: '1rem', textAlign: 'center' }}>
                Implementamos las últimas tecnologías para facilitar la gestión de proyectos y la comunicación fluida entre talento y empresa.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <Award size={36} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>Calidad</h3>
              <p className={styles.heroText} style={{ fontSize: '1rem', textAlign: 'center' }}>
                Mantenemos un estricto proceso de verificación para asegurar que solo los profesionales más capacitados formen parte de nuestra red.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <Shield size={36} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>Confianza</h3>
              <p className={styles.heroText} style={{ fontSize: '1rem', textAlign: 'center' }}>
                Tus pagos y tu información están protegidos por sistemas de seguridad de nivel bancario y contratos inteligentes.
              </p>
            </div>
          </div>
        </section>

        {/* --- STATS SECTION --- */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div>
              <span className={styles.statNumber}>100</span>
              <span className={styles.statLabel}>Freelancers Activos</span>
            </div>
            <div>
              <span className={styles.statNumber}>50</span>
              <span className={styles.statLabel}>Proyectos Exitosos</span>
            </div>
            <div>
              <span className={styles.statNumber}>98%</span>
              <span className={styles.statLabel}>Satisfacción</span>
            </div>
          </div>
        </section>

        {/* --- TEAM SECTION --- */}


        {/* --- FUTURE SECTION --- */}
        <section className={styles.futureSection}>
          <div className={styles.futureContent}>
            <h2 className={styles.sectionHeading} style={{ marginBottom: '2rem' }}>Crecimiento y Futuro</h2>
            <div className={styles.textBlock}>
              <p>
                Nuestra visión a largo plazo es convertirnos en el ecosistema definitivo para el trabajo global. Estamos expandiendo nuestras fronteras para integrar nuevas verticales de servicios, educación continua y herramientas financieras diseñadas exclusivamente para el ecosistema freelance.
              </p>
              <p>
                El futuro del trabajo es flexible, colaborativo y sin fronteras. Y en ChambexCity, estamos construyendo la infraestructura para que eso sea una realidad para todos.
              </p>
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaGlow}></div>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Sé parte de la revolución del trabajo</h2>
            <p className={styles.heroText}>
              Únete hoy mismo a miles de profesionales y empresas que ya están transformando sus ideas en realidad.
            </p>
            <div className={styles.ctaButtons}>

              {/* Botón 1: Manda a registro con rol de freelancer */}
              <Link href="/register?role=freelancer">
                <button className={styles.btnPrimary} style={{ cursor: 'pointer' }}>
                  Unirse como Freelancer
                </button>
              </Link>

              {/* Botón 2: Manda a registro con rol de empresa */}
              <Link href="/register?role=company">
                <button className={styles.btnOutline} style={{ cursor: 'pointer' }}>
                  Contratar Talento
                </button>
              </Link>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}