'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function CompleteProfileModal({ session, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [jobTitles, setJobTitles] = useState([]);
  const [formData, setFormData] = useState({
    job_title_id: '',
    hourly_rate: ''
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // 1. Cargar la lista de Títulos al abrir
  useEffect(() => {
    const fetchTitles = async () => {
      const { data } = await supabase.from('job_titles').select('*').order('name');
      if (data) setJobTitles(data);
    };
    fetchTitles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Actualizar el perfil del Freelancer
      const { error } = await supabase
        .from('freelancers')
        .update({
          job_title_id: parseInt(formData.job_title_id),
          hourly_rate: parseFloat(formData.hourly_rate),
          // Aprovechamos para marcar que ya no es un registro nuevo si quisieras
        })
        .eq('id', session.user.id);

      if (error) throw error;

      // 3. Avisar al componente padre que ya terminó
      if (onComplete) onComplete();
      
    } catch (error) {
      alert('Error actualizando perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>¡Bienvenido, {session.user.user_metadata.first_name}!</h2>
        <p style={styles.subtitle}>Para empezar a recibir ofertas, necesitamos saber qué haces y cuánto cobras.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Selector de Título */}
          <div style={styles.field}>
            <label style={styles.label}>¿Cuál es tu rol principal?</label>
            <select 
              style={styles.input} 
              required
              value={formData.job_title_id}
              onChange={(e) => setFormData({...formData, job_title_id: e.target.value})}
            >
              <option value="">Selecciona una opción...</option>
              {jobTitles.map((title) => (
                <option key={title.id} value={title.id}>
                  {title.name}
                </option>
              ))}
            </select>
          </div>

          {/* Input de Tarifa */}
          <div style={styles.field}>
            <label style={styles.label}>Tu tarifa por hora (USD)</label>
            <div style={{position: 'relative'}}>
              <span style={styles.currency}>$</span>
              <input 
                type="number" 
                min="1" 
                step="0.5"
                style={{...styles.input, paddingLeft: '30px'}}
                required
                placeholder="Ej. 25.00"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Guardando...' : 'Completar Perfil'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Estilos rápidos en línea (puedes pasarlos a CSS Modules luego)
const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' },
  modal: { background: 'white', padding: '40px', borderRadius: '16px', width: '90%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
  title: { margin: '0 0 10px 0', fontSize: '1.5rem', color: '#0F172A', textAlign: 'center' },
  subtitle: { margin: '0 0 30px 0', color: '#64748B', textAlign: 'center', lineHeight: '1.5' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#334155' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
  currency: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontWeight: 'bold' },
  btn: { background: '#0F172A', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', marginTop: '10px' }
};