'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import Header from '../../../../components/layout/Header';

// --- ICONOS SVG INTEGRADOS (Para no depender de librerías externas) ---
const Icons = {
  MapPin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Briefcase: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Globe: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
};

export default function RegisterFreelancerPage() {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // --- ESTADOS ---
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    cityId: '',
    districtId: '',
    address: '',
  });

  const [citiesList, setCitiesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);

  // Buscadores y Selecciones
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]); // Array IDs
  const [selectedLanguages, setSelectedLanguages] = useState([]); // Array {id, level}
  const [tempLangId, setTempLangId] = useState('');
  const [tempLangLevel, setTempLangLevel] = useState('Nativo');

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      const { data: cities } = await supabase.from('cities').select('id, name').order('name');
      if (cities) setCitiesList(cities);
      
      const { data: skills } = await supabase.from('skills').select('id, name').order('name');
      if (skills) setSkillsList(skills);

      const { data: langs } = await supabase.from('languages').select('id, name').order('name');
      if (langs) setLanguagesList(langs);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.cityId) {
        setDistrictsList([]);
        return;
      }
      const { data: districts } = await supabase
        .from('districts')
        .select('id, name')
        .eq('city_id', formData.cityId)
        .order('name');
      if (districts) setDistrictsList(districts);
    };
    fetchDistricts();
  }, [formData.cityId]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill.id)) {
      setSelectedSkills([...selectedSkills, skill.id]);
    }
    setSkillSearch('');
  };

  const removeSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter(id => id !== skillId));
  };

  const filteredSkills = skillsList.filter(s => 
    s.name.toLowerCase().includes(skillSearch.toLowerCase()) && 
    !selectedSkills.includes(s.id)
  ).slice(0, 5);

  const addLanguage = () => {
    if (tempLangId && !selectedLanguages.find(l => l.id === parseInt(tempLangId))) {
      setSelectedLanguages([...selectedLanguages, { id: parseInt(tempLangId), level: tempLangLevel }]);
      setTempLangId('');
    }
  };

  const removeLanguage = (langId) => {
    setSelectedLanguages(selectedLanguages.filter(l => l.id !== langId));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (!formData.cityId) throw new Error("Selecciona una ciudad.");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Redirigir al login tras hacer clic en el correo
          emailRedirectTo: `${window.location.origin}/login`, 
          data: {
            // Estos nombres deben coincidir con lo que pusiste en tu TRIGGER SQL
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: 'freelancer',
            city_id: parseInt(formData.cityId),
            birth_date: formData.birthDate
          },
        },
      });

      if (authError) throw authError;

      // 2. Manejo de éxito con verificación pendiente
      // Si tenemos usuario (authData.user) pero NO sesión (authData.session),
      // significa que Supabase espera la confirmación por correo.
      if (authData.user && !authData.session) {
        
        // --- GUARDAR DATOS "EXTRAS" PARA DESPUÉS ---
        // Como el trigger solo guarda lo básico, guardamos Skills, Idiomas y Dirección
        // en el navegador (LocalStorage) para recuperarlos cuando el usuario haga login por primera vez.
        localStorage.setItem('pending_onboarding_skills', JSON.stringify(selectedSkills));
        localStorage.setItem('pending_onboarding_langs', JSON.stringify(selectedLanguages));
        localStorage.setItem('pending_onboarding_address', JSON.stringify({
            address: formData.address,
            districtId: formData.districtId
        }));

        // Mensaje final
        alert("¡Registro exitoso! Hemos enviado un enlace de confirmación a tu correo. Por favor verifícalo para activar tu cuenta.");
        router.push('/login');
      } 
      
      // Caso raro: Si la confirmación de email estuviera desactivada en Supabase,
      // entraría aquí (con sesión). El trigger igual funcionaría, así que redirigimos.
      else if (authData.session) {
        router.push('/dashboard/freelancer');
      }

    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Error al registrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.mainWrapper}>
        <div style={styles.card}>
          
          <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', marginBottom: '8px'}}>Crear cuenta Freelancer</h1>
            <p style={{color: '#64748b'}}>Únete a la red de talento más exclusiva.</p>
          </div>

          <form onSubmit={handleRegister} style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
            
            {/* SECCIÓN 1: DATOS PERSONALES */}
            <div>
              <h3 style={styles.sectionTitle}>
                <Icons.User /> Información Personal
              </h3>
              <div style={styles.grid2}>
                <InputGroup label="Nombre" name="firstName" placeholder="Juan" onChange={handleChange} required />
                <InputGroup label="Apellido" name="lastName" placeholder="Pérez" onChange={handleChange} required />
                <InputGroup label="Correo" name="email" type="email" placeholder="juan@ejemplo.com" onChange={handleChange} required />
                <InputGroup label="Contraseña" name="password" type="password" placeholder="••••••" onChange={handleChange} required minLength={6} />
                <InputGroup label="Fecha Nacimiento" name="birthDate" type="date" onChange={handleChange} required />
              </div>
            </div>

            <div style={styles.divider} />

            {/* SECCIÓN 2: UBICACIÓN */}
            <div>
              <h3 style={styles.sectionTitle}>
                <Icons.MapPin /> Ubicación
              </h3>
              <div style={styles.grid2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <label style={styles.label}>Ciudad *</label>
                  <select name="cityId" onChange={handleChange} required defaultValue="" style={styles.input}>
                    <option value="" disabled>Selecciona ciudad</option>
                    {citiesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <label style={styles.label}>Distrito</label>
                  <select 
                    name="districtId" 
                    onChange={handleChange} 
                    style={{...styles.input, backgroundColor: !formData.cityId ? '#f1f5f9' : 'white'}}
                    disabled={!formData.cityId}
                    defaultValue=""
                  >
                    <option value="" disabled>Selecciona distrito</option>
                    {districtsList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                
                {/* Dirección ocupa 2 columnas */}
                <div style={{gridColumn: '1 / -1'}}>
                   <InputGroup label="Dirección / Calle" name="address" placeholder="Av. Principal 123" onChange={handleChange} />
                </div>
              </div>
            </div>

            <div style={styles.divider} />

            {/* SECCIÓN 3: PERFIL PROFESIONAL */}
            <div>
              <h3 style={styles.sectionTitle}>
                <Icons.Briefcase /> Perfil Profesional
              </h3>

              {/* IDIOMAS */}
              <div style={{marginBottom: '20px'}}>
                <label style={styles.label}>Idiomas</label>
                <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                  <select 
                    value={tempLangId}
                    onChange={(e) => setTempLangId(e.target.value)}
                    style={{...styles.input, flex: 1}}
                  >
                    <option value="">Añadir idioma...</option>
                    {languagesList.filter(l => !selectedLanguages.find(sl => sl.id === l.id)).map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                  <select
                    value={tempLangLevel}
                    onChange={(e) => setTempLangLevel(e.target.value)}
                    style={{...styles.input, width: '130px'}}
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Nativo">Nativo</option>
                  </select>
                  <button type="button" onClick={addLanguage} style={styles.addButton}>
                    <Icons.Plus />
                  </button>
                </div>
                
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  {selectedLanguages.map(item => {
                    const langName = languagesList.find(l => l.id === item.id)?.name;
                    return (
                      <div key={item.id} style={styles.chip}>
                        <Icons.Globe /> {langName} ({item.level})
                        <button type="button" onClick={() => removeLanguage(item.id)} style={styles.removeBtn}><Icons.X /></button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* SKILLS BUSCADOR */}
              <div>
                <label style={styles.label}>Habilidades (Skills)</label>
                <div style={{position: 'relative'}}>
                  <div style={styles.searchBox}>
                    <span style={{color: '#94a3b8', display: 'flex', alignItems:'center'}}><Icons.Search /></span>
                    <input 
                      type="text"
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      placeholder="Buscar habilidades (ej. React, Python)..."
                      style={styles.searchInput}
                    />
                  </div>
                  
                  {/* Dropdown de sugerencias */}
                  {skillSearch && filteredSkills.length > 0 && (
                    <div style={styles.dropdown}>
                      {filteredSkills.map(skill => (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => addSkill(skill)}
                          style={styles.dropdownItem}
                        >
                          {skill.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px'}}>
                  {selectedSkills.length === 0 && <span style={{fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic'}}>No has seleccionado habilidades.</span>}
                  {selectedSkills.map(sid => {
                    const s = skillsList.find(sk => sk.id === sid);
                    return (
                      <span key={sid} style={{...styles.chip, background: '#eff6ff', color: '#2563eb', borderColor: '#dbeafe'}}>
                        {s?.name}
                        <button type="button" onClick={() => removeSkill(sid)} style={{...styles.removeBtn, color: '#2563eb'}}><Icons.X /></button>
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            {errorMsg && (
              <div style={styles.errorBox}>
                ⚠️ {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.submitBtn,
                background: loading ? '#94a3b8' : '#2563eb',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creando cuenta...' : 'Completar Registro'}
            </button>

            <div style={{textAlign: 'center', fontSize: '0.9rem', color: '#64748b'}}>
              ¿Ya tienes cuenta? <Link href="/login" style={{color: '#2563eb', fontWeight: '600', textDecoration: 'none'}}>Inicia Sesión</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper Inputs
function InputGroup({ label, ...props }) {
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <label style={styles.label}>{label} {props.required && '*'}</label>
      <input 
        {...props}
        style={styles.input}
      />
    </div>
  )
}

// Estilos en Objeto JS (Para no depender de Tailwind si no está configurado)
const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' },
  mainWrapper: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' },
  card: { background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', width: '100%', maxWidth: '700px', border: '1px solid #e2e8f0' },
  sectionTitle: { fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem', boxSizing: 'border-box' },
  divider: { height: '1px', background: '#e2e8f0', margin: '10px 0' },
  addButton: { background: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', width: '45px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chip: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: '#f1f5f9', color: '#475569', fontSize: '0.85rem', fontWeight: '500', border: '1px solid #e2e8f0' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', color: '#94a3b8' },
  searchBox: { display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 12px', background: 'white' },
  searchInput: { border: 'none', outline: 'none', padding: '12px', width: '100%', fontSize: '0.95rem' },
  dropdown: { position: 'absolute', top: '105%', left: 0, width: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto' },
  dropdownItem: { display: 'block', width: '100%', textAlign: 'left', padding: '10px 15px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#334155', borderBottom: '1px solid #f1f5f9' },
  errorBox: { background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', marginTop: '10px' },
  submitBtn: { width: '100%', padding: '14px', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }
};