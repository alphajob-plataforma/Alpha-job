'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// --- ICONOS ---
const Icons = {
  CheckCircle: () => <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  Loader: () => <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
};

// --- TEMA (Mismo que en registro) ---
const theme = {
    bgDark: '#131616',
    primary: '#7adcb6',
    textSecondary: '#AFA595',
    borderLight: 'rgba(255, 255, 255, 0.1)',
};

export default function VerifiedPage() {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [status, setStatus] = useState('loading'); // 'loading', 'saving', 'success', 'error'
  const [msg, setMsg] = useState('Verificando tu cuenta...');

  useEffect(() => {
    const finalizeRegistration = async () => {
      // 1. Verificar sesión
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!session || sessionError) {
        setStatus('error');
        setMsg('No pudimos verificar la sesión. El enlace puede haber expirado.');
        return;
      }

      // 2. Recuperar datos pendientes del LocalStorage (del paso anterior)
      const pendingData = localStorage.getItem('pending_onboarding');
      
      if (!pendingData) {
        // Si no hay datos pendientes, quizás ya se registró antes o cambió de dispositivo
        setStatus('success'); 
        setMsg('¡Tu correo ha sido verificado correctamente!');
        return;
      }

      setStatus('saving');
      setMsg('Configurando tu perfil profesional...');

      try {
        const { freelancerData, addressData, skills, languages } = JSON.parse(pendingData);
        const userId = session.user.id;

        // A. Insertar en tabla 'freelancers' (Asumiendo que el trigger de Auth creó el profile base)
        // NOTA: Si tu BD requiere que el usuario exista en 'freelancers' primero, hacemos update o insert
        const { error: fError } = await supabase
            .from('freelancers')
            .upsert({ 
                id: userId,
                first_name: session.user.user_metadata.first_name,
                last_name: session.user.user_metadata.last_name,
                ...freelancerData 
            });
        
        if (fError) throw fError;

        // B. Insertar Dirección
        const { error: addrError } = await supabase
            .from('freelancer_direccion')
            .upsert({ freelancer_id: userId, ...addressData });
        
        if (addrError) console.error("Error dir:", addrError); // No bloqueante

        // C. Insertar Skills
        if (skills && skills.length > 0) {
            const skillsToInsert = skills.map(sid => ({ freelancer_id: userId, skill_id: sid, level: 1 }));
            await supabase.from('freelancer_skills').upsert(skillsToInsert);
        }

        // D. Insertar Idiomas
        if (languages && languages.length > 0) {
            const langsToInsert = languages.map(l => ({ freelancer_id: userId, language_id: l.id, level: l.level }));
            await supabase.from('freelancer_languages').upsert(langsToInsert);
        }

        // 3. Limpieza final
        localStorage.removeItem('pending_onboarding');
        setStatus('success');
        setMsg('¡Perfil creado exitosamente! Bienvenido a AlphaJob.');

      } catch (err) {
        console.error(err);
        setStatus('error');
        setMsg('Tu correo se verificó, pero hubo un error guardando los detalles del perfil. Podrás completarlos luego.');
      }
    };

    finalizeRegistration();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.blobBackground}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
      </div>

      <div style={styles.card}>
        {status === 'loading' || status === 'saving' ? (
            <>
                <div style={styles.spinner}><Icons.Loader /></div>
                <h1 style={styles.title}>Un momento...</h1>
                <p style={styles.text}>{msg}</p>
            </>
        ) : status === 'error' ? (
            <>
                <h1 style={{...styles.title, color: '#f87171'}}>Algo salió mal</h1>
                <p style={styles.text}>{msg}</p>
                <Link href="/" style={styles.button}>Volver al Inicio</Link>
            </>
        ) : (
            <>
                <div style={styles.iconCircle}>
                    <Icons.CheckCircle />
                </div>
                <h1 style={styles.title}>¡Cuenta Verificada!</h1>
                <p style={styles.text}>{msg}</p>
                <div style={styles.divider}></div>
                <button onClick={() => alert("Aquí irías al Dashboard (Próximamente)")} style={styles.primaryButton}>
                    Ir a mi Dashboard
                </button>
            </>
        )}
      </div>
    </div>
  );
}

// --- ESTILOS (Mismo lenguaje de diseño) ---
const styles = {
    pageContainer: {
        minHeight: '100vh', width: '100%', backgroundColor: theme.bgDark,
        color: '#fff', fontFamily: "'Inter', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden'
    },
    blobBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
    blob1: { position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: `radial-gradient(circle, ${theme.primary}1a 0%, transparent 70%)`, borderRadius: '50%' },
    blob2: { position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: `radial-gradient(circle, ${theme.primary}0d 0%, transparent 70%)`, borderRadius: '50%' },
    
    card: {
        position: 'relative', zIndex: 10,
        backgroundColor: 'rgba(29, 37, 34, 0.95)',
        border: `1px solid ${theme.borderLight}`,
        borderRadius: '24px', padding: '60px 40px',
        textAlign: 'center', maxWidth: '500px', width: '90%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        animation: 'fadeIn 0.5s ease-out'
    },
    iconCircle: {
        color: theme.primary, marginBottom: '20px',
        filter: `drop-shadow(0 0 10px ${theme.primary}66)`
    },
    spinner: {
        color: theme.primary, marginBottom: '20px',
        animation: 'spin 1s linear infinite'
    },
    title: { fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px 0', color: '#fff' },
    text: { fontSize: '1.1rem', color: theme.textSecondary, lineHeight: 1.6, marginBottom: '30px' },
    divider: { width: '100%', height: '1px', backgroundColor: theme.borderLight, margin: '0 0 30px 0' },
    
    primaryButton: {
        width: '100%', padding: '16px', backgroundColor: theme.primary, color: theme.bgDark,
        border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem',
        cursor: 'pointer', transition: 'transform 0.1s', textDecoration: 'none'
    },
    button: {
        display: 'inline-block', padding: '12px 24px', border: `1px solid ${theme.borderLight}`,
        borderRadius: '12px', color: '#fff', textDecoration: 'none', transition: 'background 0.2s'
    }
};

// Necesario para la animación del spinner si usas CSS en JS puro
const globalStyle = `
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;