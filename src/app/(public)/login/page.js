'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// --- ICONOS SVG ---
const Icons = {
  ArrowLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  Briefcase: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Mail: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.09"/><path d="m2 2 20 20"/></svg>,
  Star: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Google: () => <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
  Linkedin: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
};

export default function LoginPage() {
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Eliminamos userType porque el login es universal
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        router.push('/dashboard');
        return;
      }

      if (profile.role === 'freelancer') {
        router.push('/freelancer');
      } else {
        router.push('/client');
      }

    } catch (error) {
      console.error(error);
      setErrorMsg('Credenciales incorrectas o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; margin: 0; }
        .input-field:focus {
          border-color: #2563EB !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
        }
        .btn-hover:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-hover:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .social-btn:hover { background-color: #F8FAFC !important; border-color: #CBD5E1 !important; }
        .tab-btn { transition: all 0.2s ease; }
        .tab-btn:hover { border-color: #94A3B8; transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .back-link:hover { color: #0F172A !important; }

        @media (max-width: 1024px) {
          .image-side { display: none !important; }
          .form-side { padding: 20px !important; }
        }
      `}} />

      <div style={styles.pageContainer}>
        
        {/* === IZQUIERDA === */}
        <div className="image-side" style={styles.imageSection}>
          <div style={styles.overlayGradient}>
            <Link href="/" className="back-link" style={styles.backButton}>
              <Icons.ArrowLeft />
              <span>Volver al inicio</span>
            </Link>
            <div style={styles.testimonialCard}>
              <div style={styles.stars}>
                {[1,2,3,4,5].map(i => <Icons.Star key={i}/>)}
              </div>
              <h3 style={styles.quote}>"Gestionar mi equipo remoto nunca había sido tan fácil. Encontré talento verificado en minutos."</h3>
              
              <div style={styles.authorContainer}>
                <div style={styles.avatar}>CR</div>
                <div>
                  <div style={styles.authorName}>Carlos Rodríguez</div>
                  <div style={styles.authorRole}>CTO, TechFlow Inc.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === DERECHA === */}
        <div className="form-side" style={styles.formSection}>
          
          <div style={styles.formContent}>
            <div style={styles.header}>
              <h1 style={styles.title}>Bienvenido de nuevo</h1>
              <p style={styles.subtitle}>Accede a la red de talento más exclusiva.</p>
            </div>

            {errorMsg && (
              <div style={{color: '#DC2626', backgroundColor: '#FEF2F2', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #FECACA', textAlign: 'center'}}>
                {errorMsg}
              </div>
            )}

            <form style={styles.form} onSubmit={handleLogin}>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Correo Electrónico</label>
                <div style={styles.inputWrapper}>
                  <div style={styles.inputIcon}><Icons.Mail /></div>
                  <input 
                    type="email" 
                    required
                    placeholder="nombre@ejemplo.com" 
                    className="input-field"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>Contraseña</label>
                  <Link href="/forgot-password" style={styles.forgotLink}>¿Olvidaste la contraseña?</Link>
                </div>
                <div style={styles.inputWrapper}>
                  <div style={styles.inputIcon}><Icons.Lock /></div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Tu contraseña" 
                    className="input-field"
                    style={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-hover" 
                style={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>o inicia con</span>
              <span style={styles.dividerLine}></span>
            </div>

            <div style={styles.socialButtons}>
              <button className="social-btn" style={styles.socialBtn} type="button">
                <Icons.Google />
                <span>Google</span>
              </button>
              <button className="social-btn" style={styles.socialBtn} type="button">
                <Icons.Linkedin />
                <span>LinkedIn</span>
              </button>
            </div>

            {/* SECCIÓN DE REGISTRO MOVIDA AL FINAL */}
            <div style={{ marginTop: '30px' }}>
                <p style={styles.footerText}>¿Aún no tienes una cuenta? <span style={{fontWeight:'600', color: '#334155'}}>Regístrate hoy:</span></p>
                
                <div style={styles.tabsContainer}>
                    {/* BOTÓN EMPRESA */}
                    <Link href="/register/company" className="tab-btn" style={{...styles.tab, textDecoration: 'none'}}>
                        <Icons.Briefcase />
                        <span>Quiero Contratar</span>
                    </Link>
                    
                    {/* BOTÓN FREELANCER (LINK ACTUALIZADO) */}
                    <Link href="/register/freelancer" className="tab-btn" style={{...styles.tab, ...styles.freelancerTab, textDecoration: 'none'}}>
                        <Icons.User />
                        <span>Quiero Trabajar</span>
                    </Link>
                </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// --- ESTILOS JAVASCRIPT ---
const styles = {
  pageContainer: { display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#fff' },
  imageSection: { flex: '1', position: 'relative', backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' },
  overlayGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%)', display: 'flex', alignItems: 'flex-end', padding: '60px' },
  testimonialCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white', maxWidth: '520px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
  stars: { display: 'flex', gap: '4px', marginBottom: '16px' },
  quote: { fontSize: '1.25rem', fontWeight: '500', lineHeight: '1.5', marginBottom: '24px', fontFamily: '"Inter", serif' },
  authorContainer: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#fff', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' },
  authorName: { fontWeight: '700', fontSize: '0.95rem' },
  authorRole: { fontSize: '0.85rem', opacity: 0.8 },
  formSection: { flex: '1', display: 'flex', flexDirection: 'column', position: 'relative', justifyContent: 'center', alignItems: 'center', padding: '40px', backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: '40px', left: '40px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem', transition: 'color 0.2s' },
  formContent: { width: '100%', maxWidth: '420px' },
  header: { marginBottom: '32px', textAlign: 'center' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#1E293B', marginBottom: '8px', letterSpacing: '-0.5px' },
  subtitle: { color: '#64748B', fontSize: '1rem' },
  // Ajuste en el contenedor de pestañas para que se vean bien abajo
  tabsContainer: { display: 'flex', gap: '12px', marginTop: '16px' },
  tab: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: '#475569', backgroundColor: '#fff', transition: 'all 0.2s' },
  freelancerTab: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', color: '#2563EB' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#334155' },
  labelRow: { display: 'flex', justifyContent: 'space-between' },
  forgotLink: { fontSize: '0.85rem', color: '#2563EB', textDecoration: 'none', fontWeight: '600' },
  inputWrapper: { position: 'relative' },
  input: { width: '100%', padding: '12px 16px 12px 44px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '1rem', outline: 'none', color: '#0F172A', transition: 'border-color 0.2s, box-shadow 0.2s', height: '48px', boxSizing: 'border-box' },
  inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex' },
  eyeButton: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex' },
  submitBtn: { marginTop: '12px', backgroundColor: '#0F172A', color: 'white', padding: '14px', height: '50px', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)', transition: 'all 0.2s' },
  divider: { display: 'flex', alignItems: 'center', margin: '28px 0', color: '#94A3B8', fontSize: '0.85rem' },
  dividerLine: { flex: 1, height: '1px', backgroundColor: '#E2E8F0' },
  dividerText: { padding: '0 12px', fontWeight: '500' },
  socialButtons: { display: 'flex', gap: '12px', marginBottom: '20px' },
  socialBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '44px', padding: '0 16px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', color: '#334155', transition: 'all 0.2s' },
  footerText: { textAlign: 'center', fontSize: '0.95rem', color: '#64748B', marginBottom: '8px' },
};