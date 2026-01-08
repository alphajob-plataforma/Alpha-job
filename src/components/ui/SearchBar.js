'use client';
import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch, suggestionsData = [] }) { // <--- Recibe datos reales
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Filtrar sugerencias BASADAS EN LOS DATOS REALES QUE RECIBIMOS
  useEffect(() => {
    if (term.length > 0 && suggestionsData.length > 0) {
      const lowerTerm = term.toLowerCase();
      // Filtramos la lista real que nos pasa el padre
      const filtered = suggestionsData.filter(item => 
        item.toLowerCase().includes(lowerTerm)
      ).slice(0, 5); // Mostramos máximo 5 para no saturar
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [term, suggestionsData]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSearch = (textToSearch) => {
    const finalTerm = textToSearch || term;
    setTerm(finalTerm);
    setShowSuggestions(false);
    if (onSearch) onSearch(finalTerm);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
      <div style={{ 
        display: 'flex', gap: '10px', background: '#FFFFFF', padding: '8px', 
        borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', border: '1px solid #CBD5E1', zIndex: 20
      }}>
        <span style={{ display: 'flex', alignItems: 'center', paddingLeft: '12px', fontSize: '1.2rem' }}>🔍</span>
        <input 
          type="text" 
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Busca por puesto, empresa o habilidad..." 
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#0F172A' }}
        />
        <button 
          onClick={() => handleSearch()}
          style={{ background: '#2563EB', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
        >
          Buscar
        </button>
      </div>

      {/* Sugerencias Dinámicas */}
      {showSuggestions && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute', top: '105%', left: 0, right: 0, background: 'white', 
          listStyle: 'none', padding: '8px 0', margin: 0, borderRadius: '12px', 
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', zIndex: 50
        }}>
          {suggestions.map((sug, i) => (
            <li 
              key={i} 
              onClick={() => handleSearch(sug)}
              style={{ padding: '10px 20px', cursor: 'pointer', color: '#475569', borderBottom: '1px solid #F1F5F9' }}
              onMouseOver={(e) => e.target.style.background = '#F8FAFC'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              {sug}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}