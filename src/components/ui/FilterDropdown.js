'use client';
import { useState, useRef, useEffect } from 'react';

export default function FilterDropdown({ label, options, activeValue, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Cerrar menú si clickeas fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Si hay un valor activo, cambiamos el estilo del botón
  const isActive = activeValue !== null;

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      
      {/* EL BOTÓN (DISPARADOR) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: isActive ? '#EFF6FF' : 'white', 
          color: isActive ? '#2563EB' : '#334155',
          border: isActive ? '1px solid #2563EB' : '1px solid #CBD5E1', 
          padding: '8px 16px', 
          borderRadius: '24px', 
          fontSize: '0.9rem', 
          fontWeight: '600', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      >
        {isActive ? activeValue : label} 
        <span style={{ fontSize: '0.7rem' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* EL MENÚ DESPLEGABLE */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          minWidth: '200px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #E2E8F0',
          zIndex: 40,
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {/* Opción para limpiar filtro */}
          {isActive && (
            <button 
              onClick={() => { onSelect(null); setIsOpen(false); }}
              style={{ padding: '8px', textAlign: 'left', color: '#EF4444', background: 'none', border:'none', cursor:'pointer', fontWeight: '600', fontSize:'0.85rem' }}
            >
              ✕ Limpiar filtro
            </button>
          )}

          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onSelect(opt); setIsOpen(false); }}
              style={{
                textAlign: 'left',
                background: activeValue === opt ? '#EFF6FF' : 'transparent',
                color: activeValue === opt ? '#2563EB' : '#475569',
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => !isActive && (e.target.style.background = '#F8FAFC')}
              onMouseOut={(e) => !isActive && (e.target.style.background = 'transparent')}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}