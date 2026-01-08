'use client';
import { useState, useEffect } from 'react';

// --- TEMA (Colores extraídos para que coincidan con tus estilos) ---
const theme = {
  bgDark: '#0f1115',       // Fondo principal oscuro
  primary: '#4ade80',      // Verde neón
  textSecondary: '#94a3b8', // Gris texto
  borderLight: '#2d3748',   // Bordes sutiles
  surfaceDark: '#181b21'    // Fondo de tarjetas/inputs
};

// --- ICONOS ---
const Icons = {
  Mail: () => <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Globe: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  Shield: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
  Headphones: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>,
  Users: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  X: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
};

export default function VerificadoPage() {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false); // Estado para el modal de soporte

  useEffect(() => {
    const storedEmail = localStorage.getItem('pending_email');
    if (storedEmail) setEmail(storedEmail);
  }, []);

  return (
    <div style={styles.pageContainer}>
      
      {/* FONDO ANIMADO (Blobs) */}
      <div style={styles.blobBackground}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
      </div>

      <div style={styles.contentWrapper}>
        
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={{color: theme.primary}}>
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path><path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path></svg>
             </div>
            <span style={styles.logoText}>AlphaJob</span>
          </div>
          <button onClick={() => setShowModal(true)} style={styles.headerLink}>
            Contactar Soporte
          </button>
        </header>

        {/* HERO SECTION (Título Principal) */}
        <div style={styles.heroSection}>
            <h1 style={styles.heroTitle}>¡Casi listo!</h1>
            <p style={styles.heroSubtitle}>Hemos enviado un enlace de confirmación seguro a tu bandeja de entrada.</p>
        </div>

        {/* CARD PRINCIPAL (FormCard) */}
        <div style={styles.formCardContainer}>
          <div style={styles.glowEffect}></div>
          <div style={styles.formCard}>
            
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center'}}>
                
                {/* Icono Grande */}
                <div style={{
                    padding: '20px', 
                    background: 'rgba(74, 222, 128, 0.1)', 
                    borderRadius: '50%', 
                    display: 'inline-flex'
                }}>
                    <Icons.Mail />
                </div>

                {/* Caja de Email (Usando estilos de inputWrapper pero read-only) */}
                <div style={{width: '100%', maxWidth: '400px'}}>
                    <label style={styles.label}>Correo enviado a:</label>
                    <div style={{...styles.inputWrapper, marginTop: '8px', padding: '14px', justifyContent: 'center'}}>
                        <span style={{color: '#fff', fontWeight: 'bold', fontSize: '1.1rem'}}>
                            {email || 'cargando...'}
                        </span>
                    </div>
                </div>

                {/* Pasos a seguir */}
                <div style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '15px', 
                    marginTop: '20px', 
                    background: theme.bgDark, 
                    padding: '20px', 
                    borderRadius: '12px',
                    width: '100%',
                    border: `1px solid ${theme.borderLight}`
                }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <Icons.Check /> <span style={{color: theme.textSecondary}}>Abre el correo de <strong>AlphaJob</strong></span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <Icons.Check /> <span style={{color: theme.textSecondary}}>Haz clic en el botón <strong>Confirmar Email</strong></span>
                    </div>
                </div>

                <p style={{fontSize: '0.85rem', color: theme.textSecondary, marginTop: '10px'}}>
                    ¿No lo encuentras? Revisa tu carpeta de Spam.
                </p>
            </div>

          </div>
        </div>

        {/* FEATURES SECTION (Usando los nuevos estilos) */}
        <div style={styles.featuresSection}>
            <div style={styles.featureCard}>
                <div style={styles.featureIcon}><Icons.Globe /></div>
                <h3 style={styles.featureTitle}>Global</h3>
                <p style={styles.featureText}>Accede a proyectos en todo el mundo.</p>
            </div>
            <div style={styles.featureCard}>
                <div style={styles.featureIcon}><Icons.Shield /></div>
                <h3 style={styles.featureTitle}>Seguro</h3>
                <p style={styles.featureText}>Clientes verificados y pagos seguros.</p>
            </div>
            <div style={styles.featureCard}>
                <div style={styles.featureIcon}><Icons.Headphones /></div>
                <h3 style={styles.featureTitle}>Soporte</h3>
                <p style={styles.featureText}>Ayuda dedicada 24/7 para ti.</p>
            </div>
            <div style={styles.featureCard}>
                <div style={styles.featureIcon}><Icons.Users /></div>
                <h3 style={styles.featureTitle}>Comunidad</h3>
                <p style={styles.featureText}>Hecho por freelancers, para freelancers.</p>
            </div>
        </div>

        {/* FOOTER */}
        <footer style={styles.footer}>
            <div style={styles.footerLinks}>
                <button style={styles.footerLink}>Política de Privacidad</button>
                <span>•</span>
                <button style={styles.footerLink}>Términos de Servicio</button>
            </div>
            © 2025 AlphaJob. Todos los derechos reservados.
        </footer>

      </div>

      {/* MODAL DE SOPORTE (Usando tus estilos de modalOverlay) */}
      {showModal && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalBox}>
                <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>Soporte AlphaJob</h2>
                    <button onClick={() => setShowModal(false)} style={styles.closeModalBtn}>
                        <Icons.X />
                    </button>
                </div>
                <div style={styles.modalContent}>
                    <p>Si tienes problemas para recibir el correo de confirmación:</p>
                    <ul style={{paddingLeft: '20px', marginBottom: '20px', color: theme.textSecondary}}>
                        <li>Verifica tu carpeta de Spam o "Promociones".</li>
                        <li>Espera unos 5 minutos, a veces hay retrasos en la red.</li>
                        <li>Si el problema persiste, escríbenos directamente.</li>
                    </ul>
                    <button 
                        onClick={() => window.location.href = 'mailto:soporte@alphajob.com'}
                        style={{...styles.submitBtn, marginTop: '0'}}
                    >
                        Enviar Correo a Soporte
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

// --- TUS ESTILOS PERSONALIZADOS ---
const styles = {
    pageContainer: { minHeight: '100vh', width: '100%', backgroundColor: theme.bgDark, color: '#fff', fontFamily: "'Inter', sans-serif", position: 'relative', overflowX: 'hidden' },
    blobBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' },
    blob1: { position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(122, 220, 182, 0.1) 0%, rgba(19, 22, 22, 0) 70%)', borderRadius: '50%' },
    blob2: { position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(122, 220, 182, 0.05) 0%, rgba(19, 22, 22, 0) 70%)', borderRadius: '50%' },
    contentWrapper: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' },
    
    // Header
    header: { width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', marginBottom: '40px' },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoText: { fontSize: '1.2rem', fontWeight: 'bold' },
    headerLink: { background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' },
    
    // Hero & Form
    heroSection: { textAlign: 'center', marginBottom: '40px', maxWidth: '700px' },
    pillBadge: { display: 'inline-flex', alignItems: 'center', padding: '6px 12px', backgroundColor: theme.surfaceDark, border: `1px solid ${theme.borderLight}`, borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', color: theme.primary, marginBottom: '16px' },
    pillDot: { width: '8px', height: '8px', backgroundColor: theme.primary, borderRadius: '50%', marginRight: '8px' },
    heroTitle: { fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, background: `linear-gradient(to right, ${theme.primary}, #fff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 16px 0' },
    heroSubtitle: { color: theme.textSecondary, fontSize: '1.1rem', lineHeight: 1.5 },
    formCardContainer: { position: 'relative', width: '100%', maxWidth: '750px', marginBottom: '80px' },
    glowEffect: { position: 'absolute', inset: '-2px', background: `linear-gradient(45deg, ${theme.primary}33, transparent, ${theme.primary}33)`, borderRadius: '24px', filter: 'blur(20px)', zIndex: -1 },
    formCard: { backgroundColor: 'rgba(29, 37, 34, 0.95)', border: `1px solid ${theme.borderLight}`, borderRadius: '24px', padding: '40px', backdropFilter: 'blur(10px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', gap: '24px' },
    formSection: { display: 'flex', flexDirection: 'column', gap: '16px' },
    sectionTitle: { fontSize: '0.85rem', textTransform: 'uppercase', color: theme.primary, fontWeight: '700', letterSpacing: '0.05em', borderBottom: `1px solid ${theme.borderLight}`, paddingBottom: '8px', marginBottom: '8px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' },
    
    // Inputs
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' },
    label: { fontSize: '0.9rem', color: theme.textSecondary, fontWeight: '500' },
    inputWrapper: { position: 'relative', backgroundColor: theme.bgDark, border: `1px solid ${theme.borderLight}`, borderRadius: '12px', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center' },
    iconSpan: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' },
    inputElement: { width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '14px 14px 14px 0', fontSize: '0.95rem', outline: 'none' },
    selectElement: { width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '14px 40px 14px 0', fontSize: '0.95rem', outline: 'none', appearance: 'none', cursor: 'pointer' },
    chevronWrapper: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: theme.textSecondary },
    textArea: { width: '100%', backgroundColor: theme.bgDark, border: `1px solid ${theme.borderLight}`, borderRadius: '12px', color: '#fff', padding: '14px', fontSize: '0.95rem', minHeight: '80px', outline: 'none', resize: 'vertical' },
    
    // UI Elements
    dropdownMenu: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: theme.surfaceDark, border: `1px solid ${theme.borderLight}`, borderRadius: '12px', marginTop: '6px', zIndex: 50, maxHeight: '220px', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' },
    dropdownItem: { display: 'block', width: '100%', padding: '12px 15px', textAlign: 'left', background: 'transparent', border: 'none', borderBottom: `1px solid ${theme.borderLight}`, cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.1s' },
    chipContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    chip: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '99px', backgroundColor: theme.bgDark, border: `1px solid ${theme.borderLight}`, fontSize: '0.85rem', color: '#fff' },
    removeBtn: { background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 0, display: 'flex' },
    languageRow: { display: 'flex', gap: '10px', alignItems: 'flex-end' },
    addBtn: { backgroundColor: theme.primary, color: theme.bgDark, border: 'none', borderRadius: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    submitBtn: { width: '100%', padding: '16px', backgroundColor: theme.primary, color: theme.bgDark, border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px', boxShadow: `0 10px 15px -3px ${theme.primary}33`, transition: 'transform 0.1s' },
    loginHint: { textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: theme.textSecondary },
    errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', textAlign: 'center' },
    
    // --- ESTILOS DE LA NUEVA SECCIÓN (FEATURES) ---
    featuresSection: {
        width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px',
        marginTop: '20px', marginBottom: '80px', textAlign: 'center'
    },
    featureCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' },
    featureIcon: { 
        width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(29, 37, 34, 0.8)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.primary,
        border: `1px solid ${theme.borderLight}`, fontSize: '1.2rem'
    },
    featureTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', margin: 0 },
    featureText: { fontSize: '0.9rem', color: theme.textSecondary, lineHeight: '1.5', margin: 0, maxWidth: '250px' },

    // --- ESTILOS DEL MODAL ---
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
    },
    modalBox: {
        backgroundColor: theme.bgDark, border: `1px solid ${theme.borderLight}`, borderRadius: '20px',
        padding: '30px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        position: 'relative', animation: 'scaleUp 0.3s ease-out'
    },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    modalTitle: { fontSize: '1.5rem', fontWeight: 'bold', color: theme.primary, margin: 0 },
    closeModalBtn: { background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '5px' },
    modalContent: { color: '#fff', fontSize: '1rem', lineHeight: 1.6 },
    modalBtn: { backgroundColor: theme.primary, color: theme.bgDark, border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },

    // Footer Links Modificados
    footer: { width: '100%', maxWidth: '1000px', borderTop: `1px solid ${theme.borderLight}`, paddingTop: '40px', textAlign: 'center', color: theme.textSecondary, fontSize: '0.85rem' },
    footerLinks: { display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center', marginBottom: '10px' },
    footerLink: { background: 'none', border: 'none', color: theme.textSecondary, textDecoration: 'none', cursor: 'pointer', fontSize: '0.85rem', transition: 'color 0.2s', padding: 0 }
};

// --- ANIMACIONES CSS (Inyectadas) ---
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `;
  document.head.appendChild(styleSheet);
}