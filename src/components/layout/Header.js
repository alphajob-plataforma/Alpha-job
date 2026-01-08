'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ 
      background: '#fff', 
      borderBottom: '1px solid #F1F5F9', 
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '1.25rem', color: '#0F172A' }}>
          <span style={{ fontSize: '1.5rem' }}>💼</span> Alpha Job
        </div>

        {/* Botones de Acción */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
          <button style={{ 
            background: 'transparent', 
            border: 'none', 
            fontWeight: '600', 
            
            padding: '8px 20px', 
            color: '#64748B', 
            cursor: 'pointer' 
          }}>
            Iniciar Sesión
          </button>
          </Link>
          <Link href="/login" style={{ textDecoration: 'none' }}>
          <button style={{ 
            background: '#2563EB', 
            color: 'white', 
            border: 'none', 
            padding: '8px 20px', 
            borderRadius: '8px', 
            fontWeight: '600', 
            cursor: 'pointer' 
          }}>
            Registrarse
          </button>
          </Link>
        </div>
      </div>
    </header>
  );
}