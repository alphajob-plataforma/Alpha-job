'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  // Lógica: Si estamos en login o registro, ocultamos el botón correspondiente para no ser redundantes
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname.includes('/register');

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        
        {/* LOGO */}
        <Link href="/" style={styles.logo}>
          Freelance<span style={{color: '#2563EB'}}>Market</span>
        </Link>

        {/* MENÚ CENTRAL (Desktop) */}
        <div style={styles.menu}>
          <Link href="/talento" style={styles.link}>Buscar Talento</Link>
          <Link href="/proyectos" style={styles.link}>Buscar Trabajo</Link>
          <Link href="/empresas" style={styles.link}>Empresas</Link>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div style={styles.authButtons}>
          {!isLoginPage && (
            <Link href="/login" style={styles.loginBtn}>
              Iniciar Sesión
            </Link>
          )}
          
          {!isRegisterPage && (
            <Link href="/register" style={styles.registerBtn}>
              Registrarse
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    height: '70px',
    borderBottom: '1px solid #E2E8F0',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 50
  },
  container: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#0F172A',
    textDecoration: 'none',
    letterSpacing: '-0.5px'
  },
  menu: {
    display: 'flex',
    gap: '30px'
  },
  link: {
    textDecoration: 'none',
    color: '#64748B',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'color 0.2s'
  },
  authButtons: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  loginBtn: {
    textDecoration: 'none',
    color: '#0F172A',
    fontWeight: '600',
    fontSize: '0.95rem',
    padding: '8px 16px'
  },
  registerBtn: {
    textDecoration: 'none',
    backgroundColor: '#0F172A',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.95rem',
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'background 0.2s'
  }
};