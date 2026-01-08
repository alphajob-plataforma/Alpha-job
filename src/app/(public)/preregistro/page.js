'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// --- ICONOS SVG (Añadidos Escudo, Usuarios y Auriculares para la nueva sección) ---
const Icons = {
  // ... (Iconos anteriores)
  Mail: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  MapPin: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Briefcase: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
  Globe: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  Lock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Dollar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
  Phone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  FileText: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  CheckCircle: () => <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  // Nuevos Iconos
  Shield: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
  Headphones: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>,
  Users: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
};

// --- TEMA ---
const theme = {
    bgDark: '#131616',
    surfaceDark: '#1d2522',
    primary: '#7adcb6',
    textSecondary: '#AFA595',
    borderLight: 'rgba(255, 255, 255, 0.1)',
    scrollbarTrack: '#131616',
    scrollbarThumb: '#2C3531',
};

// CSS Global
const globalStyles = `
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: ${theme.scrollbarTrack}; border-radius: 5px; }
  ::-webkit-scrollbar-thumb { background-color: ${theme.scrollbarThumb}; border-radius: 5px; border: 2px solid ${theme.scrollbarTrack}; }
  ::-webkit-scrollbar-thumb:hover { background-color: ${theme.primary}; }
  * { scrollbar-width: thin; scrollbar-color: ${theme.scrollbarThumb} ${theme.scrollbarTrack}; }
  select option { background-color: ${theme.surfaceDark} !important; color: #fff !important; padding: 10px; }
  
  /* Animación para el Modal */
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`;


export default function RegisterFreelancerPage() {
  const router = useRouter();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

  // Estados de Formulario y UI
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', birthDate: '', phoneNumber: '', documentId: '', jobTitleId: '', hourlyRate: '', bio: '', departmentId: '', provinceId: '', districtId: '', address: '', });
  const [departments, setDepartments] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]); 
  const [selectedLanguages, setSelectedLanguages] = useState([]); 
  const [tempLangId, setTempLangId] = useState('');
  const [tempLangLevel, setTempLangLevel] = useState('Básico');

  // --- NUEVO ESTADO PARA MODALES ---
  // null = cerrado, 'support', 'terms', 'privacy'
  const [activeModal, setActiveModal] = useState(null);

  // --- LOGICA DE CARGA DE DATOS (Igual que antes) ---
  useEffect(() => {
    const fetchCatalogs = async () => {
      const { data: deps } = await supabase.from('departments').select('id, name').order('name'); if (deps) setDepartments(deps);
      const { data: jobs } = await supabase.from('job_titles').select('id, name').order('name'); if (jobs) setJobTitles(jobs);
      const { data: skills } = await supabase.from('skills').select('id, name').order('name'); if (skills) setSkillsList(skills);
      const { data: langs } = await supabase.from('languages').select('id, name').order('name'); if (langs) setLanguagesList(langs);
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => { setProvinces([]); setDistricts([]); setFormData(p => ({ ...p, provinceId: '', districtId: '' })); if (!formData.departmentId) return; const { data } = await supabase.from('provinces').select('id, name').eq('department_id', formData.departmentId).order('name'); if (data) setProvinces(data); }; fetchProvinces();
  }, [formData.departmentId]);

  useEffect(() => {
    const fetchDistricts = async () => { setDistricts([]); setFormData(p => ({ ...p, districtId: '' })); if (!formData.provinceId) return; const { data } = await supabase.from('districts').select('id, name').eq('province_id', formData.provinceId).order('name'); if (data) setDistricts(data); }; fetchDistricts();
  }, [formData.provinceId]);

  // --- HANDLERS (Simplificados) ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const addSkill = (skill) => { if (!selectedSkills.includes(skill.id)) setSelectedSkills([...selectedSkills, skill.id]); setSkillSearch(''); };
  const removeSkill = (id) => setSelectedSkills(selectedSkills.filter(s => s !== id));
  const addLanguage = () => { if (tempLangId && !selectedLanguages.find(l => l.id === parseInt(tempLangId))) { setSelectedLanguages([...selectedLanguages, { id: parseInt(tempLangId), level: tempLangLevel }]); setTempLangId(''); } };
  const removeLanguage = (id) => setSelectedLanguages(selectedLanguages.filter(l => l.id !== id));
  const filteredSkills = skillsList.filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.includes(s.id)).slice(0, 5);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // CORRECCIÓN 1: Validamos Distrito (que es el último paso de la ubicación), no "cityId"
      if (!formData.districtId) throw new Error("Por favor completa tu ubicación (Departamento, Provincia y Distrito).");
      
      // Validamos el rol profesional
      if (!formData.jobTitleId) throw new Error("Selecciona tu Rol Principal.");

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Redirigir a la carpeta 'verificado'
          emailRedirectTo: `${window.location.origin}/verificado`, 
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: 'freelancer',
            birth_date: formData.birthDate,
            phone_number: formData.phoneNumber
            // CORRECCIÓN 2: Ya no enviamos city_id aquí porque no existe en tu formulario
          },
        },
      });

      if (authError) throw authError;

      // Si el registro fue exitoso (pero requiere verificar email)
      if (authData.user && !authData.session) {
        
        // CORRECCIÓN 3: Guardamos la estructura correcta basada en tu formulario actual
        const onboardingData = {
            freelancerData: {
                birth_date: formData.birthDate,
                bio: formData.bio,
                phone_number: formData.phoneNumber,
                job_title_id: parseInt(formData.jobTitleId),
                hourly_rate: parseFloat(formData.hourlyRate),
                document_id: formData.documentId
            },
            addressData: {
                // Guardamos la jerarquía completa
                department_id: formData.departmentId,
                province_id: formData.provinceId,
                district_id: formData.districtId,
                direccion: formData.address,
                country_id: 'PE' // Valor por defecto
            },
            skills: selectedSkills,     
            languages: selectedLanguages 
        };

        localStorage.setItem('pending_onboarding', JSON.stringify(onboardingData));

        // Activar la vista de éxito
        setSuccess(true);
        window.scrollTo(0, 0);
      } 
      
      else if (authData.session) {
        // Caso raro donde no pida confirmación, lo mandamos al dashboard
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
    <div style={styles.pageContainer}>
      <style>{globalStyles}</style>

      {/* --- MODALES --- */}
      <Modal isOpen={activeModal === 'support'} onClose={() => setActiveModal(null)} title="Soporte Dedicado">
        <p style={{marginBottom: '15px'}}>Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier problema durante tu registro.</p>
        <ul style={{color: theme.textSecondary, marginBottom: '20px', paddingLeft: '20px'}}>
            <li>Chat en vivo: <span style={{color: theme.primary}}>Disponible</span></li>
            <li>Correo: soporte@alphajob.com</li>
            <li>Teléfono: +51 123 456 789</li>
        </ul>
        <button style={styles.modalBtn} onClick={() => setActiveModal(null)}>Entendido</button>
      </Modal>

      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Política de Privacidad">
        <p style={{marginBottom: '10px'}}>En AlphaJob, nos tomamos muy en serio tu privacidad.</p>
        <p style={{fontSize: '0.9rem', color: theme.textSecondary, lineHeight: '1.5'}}>
            Tus datos personales son encriptados y nunca serán compartidos con terceros sin tu consentimiento explícito. 
            Utilizamos la información únicamente para validar tu perfil profesional y conectarte con oportunidades relevantes.
        </p>
      </Modal>

      <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="Términos de Servicio">
        <p style={{fontSize: '0.9rem', color: theme.textSecondary, lineHeight: '1.5'}}>
            Al registrarte en AlphaJob, aceptas operar como un profesional independiente. La plataforma cobra una comisión del 10% sobre los proyectos completados. 
            El pago está garantizado a través de nuestro sistema de Escrow. Se prohíbe el contacto externo con clientes antes de iniciar un contrato.
        </p>
      </Modal>


      <div style={styles.blobBackground}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
      </div>

      <div style={styles.contentWrapper}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
             <div style={{color: theme.primary}}>
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path><path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path></svg>
             </div>
             <h2 style={styles.logoText}>AlphaJob</h2>
          </div>
          {/* Botón que abre el modal de soporte */}
          <button onClick={() => setActiveModal('support')} style={styles.headerLink}>Contactar Soporte</button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {success ? (
             <div style={styles.successCard}>
                <div style={styles.iconCircle}><Icons.CheckCircle /></div>
                <h2 style={styles.successTitle}>¡Bienvenido a Bordo!</h2>
                <p style={styles.successText}>Tu cuenta ha sido creada exitosamente. Hemos enviado un enlace de confirmación a: <br/><strong style={{color: '#fff'}}>{formData.email}</strong></p>
                <Link href="/login" style={styles.successButton}>Ir a Iniciar Sesión</Link>
             </div>
        ) : (
            <>
                <div style={styles.heroSection}>
                    <div style={styles.pillBadge}><span style={styles.pillDot}></span>REGISTRO FREELANCER</div>
                    <h1 style={styles.heroTitle}>El Futuro del <br/> Freelance está aquí.</h1>
                    <p style={styles.heroSubtitle}>Completa tu perfil profesional y accede a las mejores oportunidades laborales verificadas.</p>
                </div>

                <div style={styles.formCardContainer}>
                    <div style={styles.glowEffect}></div>
                    <form onSubmit={handleRegister} style={styles.formCard}>
                        {/* 1. CUENTA */}
                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Datos de Acceso</h3>
                            <div style={styles.row}>
                                <InputClassic label="Correo Electrónico" icon={<Icons.Mail/>} name="email" type="email" placeholder="hola@ejemplo.com" onChange={handleChange} required />
                                <InputClassic label="Contraseña" icon={<Icons.Lock/>} name="password" type="password" placeholder="••••••" onChange={handleChange} required />
                            </div>
                        </div>
                        {/* 2. PERSONAL */}
                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Información Personal</h3>
                            <div style={styles.row}>
                                <InputClassic label="Nombres" icon={<Icons.User/>} name="firstName" onChange={handleChange} required />
                                <InputClassic label="Apellidos" icon={<Icons.User/>} name="lastName" onChange={handleChange} required />
                            </div>
                            <div style={styles.grid3}>
                                <InputClassic label="DNI" icon={<Icons.FileText/>} name="documentId" onChange={handleChange} required />
                                <InputClassic label="Teléfono" icon={<Icons.Phone/>} name="phoneNumber" onChange={handleChange} required />
                                <InputClassic label="Fecha Nac." icon={<Icons.Calendar/>} name="birthDate" type="date" onChange={handleChange} required />
                            </div>
                        </div>
                        {/* 3. PERFIL Y UBICACIÓN */}
                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Perfil Profesional</h3>
                            <div style={styles.row}>
                                <SelectClassic label="Rol Principal" icon={<Icons.Briefcase/>} name="jobTitleId" onChange={handleChange} required value={formData.jobTitleId}>
                                    <option value="" disabled>Selecciona tu rol...</option>
                                    {jobTitles.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
                                </SelectClassic>
                                <InputClassic label="Tarifa Hora (USD)" icon={<Icons.Dollar/>} name="hourlyRate" type="number" step="0.01" onChange={handleChange} required />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Sobre ti (Bio)</label>
                                <textarea name="bio" onChange={handleChange} placeholder="Breve resumen..." style={styles.textArea} />
                            </div>
                             <div style={styles.grid3}>
                                <SelectClassic label="Departamento" icon={<Icons.MapPin/>} name="departmentId" onChange={handleChange} required value={formData.departmentId}>
                                    <option value="" disabled>Selecciona...</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </SelectClassic>
                                <SelectClassic label="Provincia" icon={<Icons.MapPin/>} name="provinceId" onChange={handleChange} disabled={!formData.departmentId} required value={formData.provinceId}>
                                    <option value="" disabled>Selecciona...</option>
                                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </SelectClassic>
                                <SelectClassic label="Distrito" icon={<Icons.MapPin/>} name="districtId" onChange={handleChange} disabled={!formData.provinceId} required value={formData.districtId}>
                                    <option value="" disabled>Selecciona...</option>
                                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </SelectClassic>
                            </div>
                             <InputClassic label="Dirección Exacta" icon={<Icons.MapPin/>} name="address" placeholder="Av. Principal #123" onChange={handleChange} required />
                        </div>
                        {/* 4. SKILLS & IDIOMAS */}
                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Habilidades</h3>
                            <div style={{position: 'relative'}}>
                                <InputClassic label="Buscar Skill" icon={<Icons.Search/>} value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)} placeholder="Ej. React..." />
                                {skillSearch && filteredSkills.length > 0 && (
                                    <div style={styles.dropdownMenu}>
                                        {filteredSkills.map(skill => <DropdownItem key={skill.id} onClick={() => addSkill(skill)}>{skill.name}</DropdownItem>)}
                                    </div>
                                )}
                            </div>
                            <div style={styles.chipContainer}>
                                {selectedSkills.map(sid => <span key={sid} style={styles.chip}>{skillsList.find(s => s.id === sid)?.name}<button type="button" onClick={() => removeSkill(sid)} style={styles.removeBtn}><Icons.X/></button></span>)}
                            </div>
                            <div style={styles.languageRow}>
                                <div style={{flex: 1}}>
                                    <SelectClassic label="Añadir Idioma" icon={<Icons.Globe/>} value={tempLangId} onChange={(e) => setTempLangId(e.target.value)} >
                                        <option value="" disabled>Idioma...</option>
                                        {languagesList.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </SelectClassic>
                                </div>
                                <div style={{width: '120px'}}>
                                    <SelectClassic label="Nivel" icon={null} value={tempLangLevel} onChange={(e) => setTempLangLevel(e.target.value)}>
                                        <option value="Básico">Básico</option>
                                        <option value="Intermedio">Intermedio</option>
                                        <option value="Avanzado">Avanzado</option>
                                        <option value="Nativo">Nativo</option>
                                    </SelectClassic>
                                </div>
                                <button type="button" onClick={addLanguage} style={styles.addBtn}><Icons.Plus/></button>
                            </div>
                            <div style={styles.chipContainer}>
                                {selectedLanguages.map(item => <span key={item.id} style={styles.chip}>{languagesList.find(l => l.id === item.id)?.name} ({item.level})<button type="button" onClick={() => removeLanguage(item.id)} style={styles.removeBtn}><Icons.X/></button></span>)}
                            </div>
                        </div>

                        {errorMsg && <div style={styles.errorAlert}>⚠️ {errorMsg}</div>}

                        <button type="submit" disabled={loading} style={loading ? {...styles.submitBtn, opacity: 0.7} : styles.submitBtn}>
                            {loading ? 'Creando Perfil...' : 'Completar Registro'}
                        </button>
                        <div style={styles.loginHint}>¿Ya tienes cuenta? <Link href="/login" style={{color: theme.primary, fontWeight: 'bold', textDecoration: 'none'}}>Inicia Sesión</Link></div>
                    </form>
                </div>
            </>
        )}

        {/* --- NUEVA SECCIÓN DE CARACTERÍSTICAS (Debajo del formulario) --- */}
        <div style={styles.featuresSection}>
            <div style={styles.featureCard}>
                <div style={styles.featureIcon}><Icons.Globe /></div>
                <h3 style={styles.featureTitle}>Oportunidades Globales</h3>
                <p style={styles.featureText}>Accede a proyectos internacionales y conecta con clientes de todo el mundo.</p>
            </div>
            <div style={styles.featureCard}>
                <div style={styles.featureIcon}><Icons.Shield /></div>
                <h3 style={styles.featureTitle}>Clientes Verificados</h3>
                <p style={styles.featureText}>Verificamos a cada cliente para que te concentres en trabajar, no en cobrar.</p>
            </div>
            <div style={styles.featureCard}>
                <div style={styles.featureIcon}><Icons.Headphones /></div>
                <h3 style={styles.featureTitle}>Soporte Dedicado</h3>
                <p style={styles.featureText}>Acceso a soporte 24/7 para resolver cualquier duda al instante.</p>
            </div>
            <div style={styles.featureCard}>
                <div style={styles.featureIcon}><Icons.Users /></div>
                <h3 style={styles.featureTitle}>Comunidad Primero</h3>
                <p style={styles.featureText}>Un mercado construido por freelancers, para freelancers.</p>
            </div>
        </div>

        {/* FOOTER */}
        <footer style={styles.footer}>
            <div style={styles.footerLinks}>
                <button onClick={() => setActiveModal('privacy')} style={styles.footerLink}>Política de Privacidad</button>
                <span style={{opacity: 0.3}}>|</span>
                <button onClick={() => setActiveModal('terms')} style={styles.footerLink}>Términos de Servicio</button>
                
            </div>
            <p style={{marginTop: '10px'}}>© 2025 AlphaJob. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

// --- COMPONENTE DE MODAL REUTILIZABLE ---
function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>{title}</h3>
                    <button onClick={onClose} style={styles.closeModalBtn}><Icons.X/></button>
                </div>
                <div style={styles.modalContent}>
                    {children}
                </div>
            </div>
        </div>
    )
}

// --- Componentes UI (Inputs, etc) ---
function InputClassic({ label, icon, ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <div style={styles.inputGroup}>
            <label style={styles.label}>{label} {props.required && <span style={{color: theme.primary}}>*</span>}</label>
            <div style={{...styles.inputWrapper, borderColor: focused ? theme.primary : theme.borderLight, boxShadow: focused ? `0 0 0 1px ${theme.primary}` : 'none'}}>
                {icon && <span style={{...styles.iconSpan, color: focused ? theme.primary : theme.textSecondary}}>{icon}</span>}
                <input {...props} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{...styles.inputElement, paddingLeft: icon ? '45px' : '15px'}} />
            </div>
        </div>
    )
}

function SelectClassic({ label, icon, children, ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <div style={styles.inputGroup}>
            <label style={styles.label}>{label} {props.required && <span style={{color: theme.primary}}>*</span>}</label>
            <div style={{...styles.inputWrapper, borderColor: focused ? theme.primary : theme.borderLight, boxShadow: focused ? `0 0 0 1px ${theme.primary}` : 'none'}}>
                {icon && <span style={{...styles.iconSpan, color: focused ? theme.primary : theme.textSecondary}}>{icon}</span>}
                <select {...props} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{...styles.selectElement, paddingLeft: icon ? '45px' : '15px'}}>{children}</select>
                <div style={styles.chevronWrapper}><Icons.ChevronDown/></div>
            </div>
        </div>
    )
}

function DropdownItem({ children, onClick }) {
    const [hover, setHover] = useState(false);
    return (
        <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{...styles.dropdownItem, backgroundColor: hover ? theme.scrollbarThumb : 'transparent', color: hover ? theme.primary : '#fff'}}>
            {children}
        </button>
    )
}

// --- ESTILOS ---
const styles = {
    pageContainer: { minHeight: '100vh', width: '100%', backgroundColor: theme.bgDark, color: '#fff', fontFamily: "'Inter', sans-serif", position: 'relative', overflowX: 'hidden' },
    blobBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' },
    blob1: { position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(122, 220, 182, 0.1) 0%, rgba(19, 22, 22, 0) 70%)', borderRadius: '50%' },
    blob2: { position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(122, 220, 182, 0.05) 0%, rgba(19, 22, 22, 0) 70%)', borderRadius: '50%' },
    contentWrapper: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' },
    
    // Header
    header: { width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', marginBottom: '40px' },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoText: { fontSize: '1.2rem', fontWeight: 'bold' },
    headerLink: { background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' },
    
    // Hero & Form
    heroSection: { textAlign: 'center', marginBottom: '40px', maxWidth: '700px' },
    pillBadge: { display: 'inline-flex', alignItems: 'center', padding: '6px 12px', backgroundColor: theme.surfaceDark, border: `1px solid ${theme.borderLight}`, borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', color: theme.primary, marginBottom: '16px' },
    pillDot: { width: '8px', height: '8px', backgroundColor: theme.primary, borderRadius: '50%', marginRight: '8px' },
    heroTitle: { fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, background: `linear-gradient(to right, ${theme.primary}, #fff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 16px 0' },
    heroSubtitle: { color: theme.textSecondary, fontSize: '1.1rem', lineHeight: 1.5 },
    formCardContainer: { position: 'relative', width: '100%', maxWidth: '750px', marginBottom: '80px' },
    glowEffect: { position: 'absolute', inset: '-2px', background: `linear-gradient(45deg, ${theme.primary}33, transparent, ${theme.primary}33)`, borderRadius: '24px', filter: 'blur(20px)', zIndex: -1 },
    formCard: { backgroundColor: 'rgba(29, 37, 34, 0.95)', border: `1px solid ${theme.borderLight}`, borderRadius: '24px', padding: '40px', backdropFilter: 'blur(10px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', gap: '24px' },
    formSection: { display: 'flex', flexDirection: 'column', gap: '16px' },
    sectionTitle: { fontSize: '0.85rem', textTransform: 'uppercase', color: theme.primary, fontWeight: '700', letterSpacing: '0.05em', borderBottom: `1px solid ${theme.borderLight}`, paddingBottom: '8px', marginBottom: '8px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' },
    
    // Inputs
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' },
    label: { fontSize: '0.9rem', color: theme.textSecondary, fontWeight: '500' },
    inputWrapper: { position: 'relative', backgroundColor: theme.bgDark, border: `1px solid ${theme.borderLight}`, borderRadius: '12px', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center' },
    iconSpan: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' },
    inputElement: { width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '14px 14px 14px 0', fontSize: '0.95rem', outline: 'none' },
    selectElement: { width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '14px 40px 14px 0', fontSize: '0.95rem', outline: 'none', appearance: 'none', cursor: 'pointer' },
    chevronWrapper: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: theme.textSecondary },
    textArea: { width: '100%', backgroundColor: theme.bgDark, border: `1px solid ${theme.borderLight}`, borderRadius: '12px', color: '#fff', padding: '14px', fontSize: '0.95rem', minHeight: '80px', outline: 'none', resize: 'vertical' },
    
    // UI Elements
    dropdownMenu: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: theme.surfaceDark, border: `1px solid ${theme.borderLight}`, borderRadius: '12px', marginTop: '6px', zIndex: 50, maxHeight: '220px', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' },
    dropdownItem: { display: 'block', width: '100%', padding: '12px 15px', textAlign: 'left', background: 'transparent', border: 'none', borderBottom: `1px solid ${theme.borderLight}`, cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.1s' },
    chipContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    chip: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '99px', backgroundColor: theme.bgDark, border: `1px solid ${theme.borderLight}`, fontSize: '0.85rem', color: '#fff' },
    removeBtn: { background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 0, display: 'flex' },
    languageRow: { display: 'flex', gap: '10px', alignItems: 'flex-end' },
    addBtn: { backgroundColor: theme.primary, color: theme.bgDark, border: 'none', borderRadius: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    submitBtn: { width: '100%', padding: '16px', backgroundColor: theme.primary, color: theme.bgDark, border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px', boxShadow: `0 10px 15px -3px ${theme.primary}33`, transition: 'transform 0.1s' },
    loginHint: { textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: theme.textSecondary },
    errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', textAlign: 'center' },
    
    // --- ESTILOS DE LA NUEVA SECCIÓN (FEATURES) ---
    featuresSection: {
        width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px',
        marginTop: '20px', marginBottom: '80px', textAlign: 'center'
    },
    featureCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' },
    featureIcon: { 
        width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(29, 37, 34, 0.8)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.primary,
        border: `1px solid ${theme.borderLight}`, fontSize: '1.2rem'
    },
    featureTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', margin: 0 },
    featureText: { fontSize: '0.9rem', color: theme.textSecondary, lineHeight: '1.5', margin: 0, maxWidth: '250px' },

    // --- ESTILOS DEL MODAL ---
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
    },
    modalBox: {
        backgroundColor: theme.bgDark, border: `1px solid ${theme.borderLight}`, borderRadius: '20px',
        padding: '30px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        position: 'relative', animation: 'scaleUp 0.3s ease-out'
    },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    modalTitle: { fontSize: '1.5rem', fontWeight: 'bold', color: theme.primary, margin: 0 },
    closeModalBtn: { background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '5px' },
    modalContent: { color: '#fff', fontSize: '1rem', lineHeight: 1.6 },
    modalBtn: { backgroundColor: theme.primary, color: theme.bgDark, border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },

    // Footer Links Modificados
    footer: { width: '100%', maxWidth: '1000px', borderTop: `1px solid ${theme.borderLight}`, paddingTop: '40px', textAlign: 'center', color: theme.textSecondary, fontSize: '0.85rem' },
    footerLinks: { display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center', marginBottom: '10px' },
    footerLink: { background: 'none', border: 'none', color: theme.textSecondary, textDecoration: 'none', cursor: 'pointer', fontSize: '0.85rem', transition: 'color 0.2s', padding: 0 }
};