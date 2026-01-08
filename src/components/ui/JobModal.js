'use client';
import { useRouter } from 'next/navigation'; // 1. IMPORTAR ROUTER
import styles from './JobModal.module.css';

// 2. AÑADIR 'session' A LOS PROPS
export default function JobModal({ job, onClose, session }) {
  const router = useRouter(); // Inicializar router

  // Si no hay trabajo seleccionado, no renderizamos nada
  if (!job) return null;

  // Extraemos los datos
  const companyName = job.companies?.commercial_name || 'Empresa Confidencial';
  const logoUrl = job.companies?.logo_url; 
  const cityName = job.companies?.cities?.name || 'Remoto';

  // 3. LÓGICA DEL CLICK EN APLICAR
  const handleApply = () => {
    if (!session) {
      // SI NO HAY SESIÓN -> REDIRIGIR AL LOGIN
      router.push('/login');
    } else {
      // SI HAY SESIÓN -> EJECUTAR APLICACIÓN
      // Aquí iría tu llamada a Supabase para guardar la postulación
      alert("¡Usuario logueado! Aplicación enviada correctamente.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>

        <div className={styles.scrollContent}>
          {/* Cabecera */}
          <div className={styles.header}>
            
            <div className={styles.logoBox}>
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={companyName} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              ) : (
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6366f1' }}>
                  {companyName.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <h2 className={styles.title}>{job.title}</h2>
              <p className={styles.company}>
                {companyName} • {cityName}
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div className={styles.section}>
            <h3>Sobre el proyecto</h3>
            <p className={styles.description}>
              {job.description || "Este proyecto no tiene una descripción detallada disponible."}
            </p>
          </div>

          {/* Habilidades */}
          <div className={styles.section}>
            <h3>Habilidades necesarias</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {job.job_skills?.length > 0 ? (
                job.job_skills.map((js, index) => (
                  <span key={index} style={{ 
                    background: '#F1F5F9', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#475569' 
                  }}>
                    {js.skills?.name}
                  </span>
                ))
              ) : (
                <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No se especificaron habilidades.</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Fijo */}
        <div className={styles.footer}>
          <div>
            <span className={styles.priceLabel}>Presupuesto del proyecto:</span>
            <span className={styles.priceValue}>${job.budget_max?.toLocaleString()} USD</span>
          </div>
          
          {/* USAMOS LA NUEVA FUNCIÓN AQUÍ */}
          <button className={styles.applyBtn} onClick={handleApply}>
            Aplicar Ahora
          </button>
        </div>

      </div>
    </div>
  );
}