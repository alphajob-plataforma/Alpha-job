'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import CompleteProfileModal from '../../../components/freelancer/CompleteProfileModal';

// Iconos rápidos para el dashboard
const Icons = {
  Wallet: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  Briefcase: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Star: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
};

export default function FreelancerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const checkSession = async () => {
      // 1. Verificar sesión
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login'); // Si no hay sesión, mandar al login
        return;
      }
      setUser(session.user);

      // 2. Verificar si faltan datos en la tabla 'freelancers'
      const { data: freelancerData, error } = await supabase
        .from('freelancers')
        .select('job_title_id, hourly_rate')
        .eq('id', session.user.id)
        .single();

      if (freelancerData) {
        // Si no tiene título O tarifa es 0 o nula, mostrar modal
        if (!freelancerData.job_title_id || !freelancerData.hourly_rate) {
          setShowOnboarding(true);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div style={styles.loading}>Cargando tu espacio de trabajo...</div>;

  return (
    <div style={styles.container}>
      {/* HEADER SIMPLE */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Alpha Job</h1>
        <div style={styles.userInfo}>
          <span>Hola, {user?.user_metadata?.first_name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Salir</button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={styles.main}>
        <h2 style={styles.welcomeTitle}>Panel de Control</h2>
        
        {/* TARJETAS DE RESUMEN */}
        <div style={styles.statsGrid}>
          <div style={styles.card}>
            <div style={{...styles.iconBox, background: '#EFF6FF', color: '#2563EB'}}><Icons.Briefcase /></div>
            <div>
              <p style={styles.statLabel}>Proyectos Activos</p>
              <p style={styles.statValue}>0</p>
            </div>
          </div>
          <div style={styles.card}>
            <div style={{...styles.iconBox, background: '#ECFDF5', color: '#059669'}}><Icons.Wallet /></div>
            <div>
              <p style={styles.statLabel}>Ganancias Mes</p>
              <p style={styles.statValue}>$0.00</p>
            </div>
          </div>
          <div style={styles.card}>
            <div style={{...styles.iconBox, background: '#FFFBEB', color: '#D97706'}}><Icons.Star /></div>
            <div>
              <p style={styles.statLabel}>Calificación</p>
              <p style={styles.statValue}>-.-</p>
            </div>
          </div>
        </div>

        {/* ÁREA DE CONTENIDO */}
        <div style={styles.contentArea}>
          <h3 style={styles.sectionTitle}>Trabajos recomendados para ti</h3>
          <p style={{color: '#64748B'}}>Aún no hay ofertas disponibles.</p>
        </div>
      </main>

      {/* MODAL DE COMPLETAR PERFIL (Se muestra si faltan datos) */}
      {showOnboarding && (
        <CompleteProfileModal 
          session={{ user }} 
          onComplete={() => setShowOnboarding(false)} 
        />
      )}
    </div>
  );
}

const styles = {
  loading: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#64748B' },
  container: { minHeight: '100vh', background: '#F8FAFC', fontFamily: 'sans-serif' },
  header: { background: 'white', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0' },
  logo: { fontSize: '1.2rem', fontWeight: 'bold', color: '#0F172A' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.9rem' },
  logoutBtn: { border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: '500' },
  main: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
  welcomeTitle: { fontSize: '1.8rem', color: '#1E293B', marginBottom: '30px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' },
  card: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px' },
  iconBox: { width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statLabel: { margin: 0, color: '#64748B', fontSize: '0.9rem' },
  statValue: { margin: '4px 0 0 0', color: '#0F172A', fontSize: '1.5rem', fontWeight: '700' },
  contentArea: { background: 'white', padding: '30px', borderRadius: '16px', border: '1px dashed #CBD5E1', minHeight: '200px' },
  sectionTitle: { marginTop: 0, color: '#334155' }
};