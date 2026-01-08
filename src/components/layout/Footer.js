'use client';

export default function Footer() {
  return (
    // CAMBIO 1: Reducimos el padding vertical general (antes era 60px 0 30px)
    <footer style={{ background: '#0F172A', color: '#E2E8F0', padding: '40px 0 20px', marginTop: '40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* SECCIÓN SUPERIOR: 4 COLUMNAS */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '30px', // CAMBIO 2: Reducimos el espacio entre columnas (antes 40px)
          marginBottom: '30px' // CAMBIO 3: Menos margen debajo de las columnas (antes 50px)
        }}>
          
          {/* Columna 1: Marca */}
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
              Alpha Job
            </h3>
            <p style={{ color: '#94A3B8', lineHeight: '1.5', fontSize: '0.85rem' }}>
              Conectando a los mejores talentos con empresas líderes. Seguridad, rapidez y calidad en cada proyecto.
            </p>
          </div>

          {/* Columna 2: Categorías */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: '700', marginBottom: '16px', fontSize: '1rem' }}>Categorías</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#" style={linkStyle}>Desarrollo Web</a></li>
              <li><a href="#" style={linkStyle}>Diseño Gráfico</a></li>
              <li><a href="#" style={linkStyle}>Marketing Digital</a></li>
              <li><a href="#" style={linkStyle}>Redacción y Traducción</a></li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: '700', marginBottom: '16px', fontSize: '1rem' }}>Soporte</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#" style={linkStyle}>Centro de Ayuda</a></li>
              <li><a href="#" style={linkStyle}>Cómo funciona</a></li>
              <li><a href="#" style={linkStyle}>Seguridad y Confianza</a></li>
              <li><a href="#" style={linkStyle}>Contacto</a></li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: '700', marginBottom: '16px', fontSize: '1rem' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#" style={linkStyle}>Política de Privacidad</a></li>
              <li><a href="#" style={linkStyle}>Términos y Condiciones</a></li>
              <li><a href="#" style={linkStyle}>Política de Cookies</a></li>
              <li><a href="#" style={linkStyle}>Propiedad Intelectual</a></li>
            </ul>
          </div>
        </div>

        {/* LÍNEA DIVISORIA */}
        <hr style={{ borderColor: '#1E293B', margin: '0 0 20px' }} />

        {/* SECCIÓN INFERIOR: COPYRIGHT */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            © 2025 Alpha Job. Todos los derechos reservados.
          </span>
          
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
             <span style={{ cursor:'pointer', color:'#94A3B8' }}>Twitter</span>
             <span style={{ cursor:'pointer', color:'#94A3B8' }}>Instagram</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

const linkStyle = {
  color: '#94A3B8',
  textDecoration: 'none',
  fontSize: '0.85rem',
  transition: 'color 0.2s'
};