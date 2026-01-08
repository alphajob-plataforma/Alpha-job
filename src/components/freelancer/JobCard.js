'use client';
import styles from './JobCard.module.css';

// Función auxiliar para calcular "Hace cuánto"
function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Hace un momento';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days} d`;
  return date.toLocaleDateString(); // Si es muy viejo, muestra la fecha normal
}

export default function JobCard({ job, onClick, variant = 'default' }) {
  if (!job) return null;

  const companyName = job.companies?.commercial_name || 'Empresa Confidencial';
  const cityName = job.companies?.cities?.name || 'Remoto';
  const skills = job.job_skills?.map(js => js.skills?.name) || [];
  const logoUrl = job.companies?.logo_url; // <-- Asumimos que traes esto de la BD
  const postedAt = timeAgo(job.created_at);
  console.log(`Empresa: ${companyName}`, "URL recibida:", logoUrl);

  // --- LÓGICA DE VARIANTES ---
  const getButtonLabel = () => {
    switch (variant) {
      case 'company': return 'Gestionar';
      case 'applied': return 'Ver Mi Propuesta';
      default: return 'Ver Oferta';
    }
  };

  const renderBadge = () => {
    if (variant === 'company') {
      const status = job.status === 'open' ? 'ABIERTA' : 'CERRADA';
      return <span className={styles.newBadge} style={job.status !== 'open' ? {background:'#F1F5F9', color:'#64748B'} : {}}>{status}</span>;
    }
    if (variant === 'applied') return <span className={styles.newBadge} style={{background: '#DBEAFE', color: '#1E40AF'}}>ENVIADO</span>;
    
    // Badge de fecha real
    return <span className={styles.timeBadge}>{postedAt}</span>;
  };

  return (
    <div className={styles.card} onClick={() => onClick && onClick(job)}>
      
      {/* 1. Logo: Si hay URL usa imagen, si no, usa el icono por defecto */}
      <div className={styles.logoContainer}>
        {logoUrl ? (
          <img src={logoUrl} alt={companyName} className={styles.companyLogo} />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        )}
      </div>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h3 className={styles.title}>{job.title}</h3>
          {renderBadge()}
        </div>

        <div className={styles.companyInfo}>
          {companyName} • <span className={styles.location}>{cityName}</span>
        </div>

        <p className={styles.description}>
          {job.description || "Sin descripción disponible."}
        </p>

        <div className={styles.skillsContainer}>
          {skills.slice(0, 3).map((skill, index) => (
            <span key={index} className={styles.skillTag}>{skill}</span>
          ))}
        </div>
      </div>

      <div className={styles.rightSide}>
        <div>
          <div className={styles.price}>${job.budget_max?.toLocaleString()}</div>
          <span className={styles.priceLabel}>Precio fijo</span>
        </div>
        <button className={styles.viewButton}>{getButtonLabel()}</button>
      </div>

    </div>
  );
}