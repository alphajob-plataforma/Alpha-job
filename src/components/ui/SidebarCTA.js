export default function SidebarCTA() {
  return (
    <div style={{ 
      background: '#2563EB', 
      borderRadius: '16px', 
      padding: '24px', 
      color: 'white', 
      textAlign: 'center',
      marginBottom: '24px'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚀</div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>
        ¿Eres Freelancer?
      </h3>
      <p style={{ fontSize: '0.9rem', opacity: '0.9', marginBottom: '20px', lineHeight: '1.5' }}>
        Únete a nuestra comunidad y accede a herramientas exclusivas, pagos seguros y soporte 24/7.
      </p>
      <button style={{ 
        background: 'white', 
        color: '#2563EB', 
        border: 'none', 
        width: '100%', 
        padding: '12px', 
        borderRadius: '8px', 
        fontWeight: '700', 
        cursor: 'pointer' 
      }}>
        Crear cuenta gratis
      </button>
    </div>
  );
}