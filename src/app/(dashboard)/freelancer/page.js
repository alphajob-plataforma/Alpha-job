'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// ❌ ELIMINAMOS el import global de pdfjs-dist de aquí arriba

import JobCard from '@/components/ui/JobCard'; 
import Modal from '@/components/ui/Modal'; 
import JobDetailContent from '@/components/jobs/JobDetailContent'; 
import styles from './freelancer.module.css';

export default function FreelancerDashboard() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); 
  const [freelancerData, setFreelancerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [uploadingCV, setUploadingCV] = useState(false);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  
  const [tempData, setTempData] = useState({ 
    first_name: '', 
    last_name: '', 
    phone: '',
    experiences: [] 
  });

  useEffect(() => {
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('freelancers')
      .select(`*, job_titles ( name ), contracts:contracts(total_paid)`)
      .eq('id', user.id)
      .single();

    if (profile) {
      const totalEarnings = profile.contracts?.reduce((acc, curr) => acc + (Number(curr.total_paid) || 0), 0) || 0;
      setFreelancerData({
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "Configura tu nombre",
        initials: `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || "?",
        role: profile.custom_job_title || profile.job_titles?.name || 'Freelancer',
        views: profile.profile_views || 0,
        completedJobs: profile.jobs_completed_count || 0,
        earnings: totalEarnings,
        skills: profile.custom_skills || []
      });
    }

    const { data: jobsData } = await supabase.from('job_postings').select(`*, companies (id, commercial_name, logo_url), job_titles(name)`).eq('status', 'open').order('created_at', { ascending: false }).limit(5); 
    if (jobsData) setJobs(jobsData);
    setLoading(false);
  };

  const extractTextFromPDF = async (file) => {
    try {
      // ✅ SOLUCIÓN: Importación dinámica SOLO cuando se ejecuta esta función (en el cliente)
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = "";
      for (let i = 1; i <= Math.min(pdf.numPages, 2); i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + " ";
      }
      return fullText;
    } catch (error) {
      console.error("Error extrayendo texto:", error);
      return "";
    }
  };

  const parseCVContent = (text) => {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    const data = {
      first_name: '',
      last_name: '',
      phone: '',
      experiences: []
    };

    const words = cleanText.split(' ');
    if (words.length > 0) data.first_name = words[0]; 
    if (words.length > 1) {
      data.last_name = words[1]; 
      if (words[2] && !/[@|+0-9]/.test(words[2])) {
        data.last_name += ' ' + words[2]; 
      }
    }

    const phoneMatch = cleanText.match(/(?:\+\d{1,3}\s?)?(?:9\d{2}[\s-]?\d{3}[\s-]?\d{3}|\d{3}[\s-]?\d{3}[\s-]?\d{3,4})/);
    if (phoneMatch) data.phone = phoneMatch[0].trim();

    const expRegex = /(?:EXPERIENCIA LABORAL|EXPERIENCIA|EXPERIENCE)(.*?)(?:EDUCACIÓN|EDUCATION|HABILIDADES|SKILLS|PROYECTOS|$)/i;
    const expMatch = cleanText.match(expRegex);

    if (expMatch && expMatch[1]) {
      const expText = expMatch[1].trim();
      const parts = expText.split('|');
      
      for (let i = 0; i < parts.length - 1; i++) {
        const chunk = parts[i].trim();
        const roleRegex = /(Desarrollador|Ingeniero|Analista|Consultor|Especialista|Manager|Gerente|Director|Diseñador|Programador|Arquitecto|Líder|Jefe|Asistente)[\w\s]+/gi;
        
        let match;
        let lastMatch = null;
        while ((match = roleRegex.exec(chunk)) !== null) {
          lastMatch = match;
        }

        if (lastMatch) {
          const role = lastMatch[0].trim();
          let rawCompany = chunk.substring(0, lastMatch.index).trim();
          const cleanCompany = rawCompany.replace(/.*(?:\.|Actualidad|\d{4})\s+/i, '').trim();

          data.experiences.push({
            company: cleanCompany || 'Empresa detectada',
            role: role
          });
        }
      }
    }

    if (data.experiences.length === 0) {
      data.experiences.push({ company: '', role: '' });
    }

    return data;
  };

  const handleCVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') return;

    setUploadingCV(true);
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const rawText = await extractTextFromPDF(file);
      const detectedData = parseCVContent(rawText);
      setTempData(detectedData);

      const filePath = `resumes/${user.id}/${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage.from('cv_files').upload(filePath, file);

      if (uploadError) throw uploadError;

      await supabase.from('freelancers').update({ resume_url: filePath, cv_status: 'pending_review' }).eq('id', user.id);
      setShowVerifyForm(true);

    } catch (error) {
      alert('Error procesando el CV.');
    } finally {
      setUploadingCV(false);
    }
  };

  const saveVerifiedData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
      await supabase.from('freelancers').update({ 
        first_name: tempData.first_name, 
        last_name: tempData.last_name,
        cv_status: 'processed' 
      }).eq('id', user.id);

      const experiencesToInsert = tempData.experiences
        .filter(exp => exp.company || exp.role)
        .map(exp => ({
          freelancer_id: user.id,
          company_name: exp.company || 'No especificada',
          role: exp.role || 'No especificado',
          start_date: new Date().toISOString().split('T')[0],
          is_current: true 
        }));

      if (experiencesToInsert.length > 0) {
        await supabase.from('freelancer_experiences').insert(experiencesToInsert);
      }

      setShowVerifyForm(false);
      loadDashboardData();
    } catch (e) {
      alert("Error al guardar.");
    }
  };

  const handleExpChange = (index, field, value) => {
    const newExps = [...tempData.experiences];
    newExps[index][field] = value;
    setTempData({ ...tempData, experiences: newExps });
  };

  const addExperience = () => {
    setTempData({ ...tempData, experiences: [...tempData.experiences, { company: '', role: '' }] });
  };

  const removeExperience = (index) => {
    const newExps = tempData.experiences.filter((_, i) => i !== index);
    setTempData({ ...tempData, experiences: newExps });
  };

  const formatSoles = (amount) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(amount);

  if (loading) return <div className={styles.loadingFull}>Cargando...</div>;

  return (
    <>
      <div className={styles.dashboardGrid}>
        <main className={styles.mainCol}>
          <section className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}><p className={styles.statLabel}>Propuestas Activas</p></div>
              <p className={styles.statValue}>5</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}><p className={styles.statLabel}>Vistas</p></div>
              <p className={styles.statValue}>{freelancerData?.views}</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}><p className={styles.statLabel}>Ganancias</p></div>
              <p className={styles.statValue}>{formatSoles(freelancerData?.earnings)}</p>
            </div>
          </section>

          <h2 className={styles.sectionTitle}>Feed de Proyectos</h2>
          <div className={styles.feed}>
            {jobs.map(job => <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />)}
          </div>
        </main>

        <aside className={styles.rightCol}>
          <div className={styles.profilePremiumCard}>
            <div className={styles.avatarContainer} style={{ position: 'relative', display: 'inline-block' }}>
              <div className={styles.avatarCircle}>{freelancerData?.initials}</div>
            </div>
            
            <h3 className={styles.profileName}>{freelancerData?.name}</h3>
            <p className={styles.profileRole} style={{ color: '#AFA595', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {freelancerData?.role}
            </p>

            <input type="file" ref={fileInputRef} onChange={handleCVUpload} accept=".pdf" style={{display: 'none'}} />
            <button className={styles.secondaryBtn} onClick={() => fileInputRef.current.click()} disabled={uploadingCV} style={{ marginBottom: '1.5rem' }}>
              {uploadingCV ? 'Analizando...' : 'Subir CV'}
            </button>

            

            <button className={styles.premiumBtn} onClick={() => router.push('/challenges')}>
              Completar Evaluaciones
            </button>
          </div>
        </aside>
      </div>

      {showVerifyForm && (
        <div className={styles.verifyOverlay}>
          <div className={styles.statCard} style={{maxWidth: '450px', width: '90%', border: '1px solid #7ADCB7', maxHeight: '90vh', overflowY: 'auto'}}>
            <h3 style={{ marginBottom: '0.5rem' }}>Verifica tu información</h3>
            <p style={{ color: '#AFA595', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Confirma los datos extraídos de tu CV:</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              
              <input className={styles.inputStyle} value={tempData.first_name} onChange={(e) => setTempData({...tempData, first_name: e.target.value})} placeholder="Nombres" />
              <input className={styles.inputStyle} value={tempData.last_name} onChange={(e) => setTempData({...tempData, last_name: e.target.value})} placeholder="Apellidos" />
              <input className={styles.inputStyle} value={tempData.phone} onChange={(e) => setTempData({...tempData, phone: e.target.value})} placeholder="Teléfono" />
              
              <div style={{height: '1px', background: '#2D3333', margin: '5px 0'}}></div>
              
              {tempData.experiences.map((exp, index) => (
                <div key={index} style={{display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h4 style={{color: '#7ADCB7', margin: 0, fontSize: '0.9rem'}}>Experiencia {index + 1}</h4>
                    {tempData.experiences.length > 1 && (
                      <button onClick={() => removeExperience(index)} style={{background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '12px'}}>
                        Eliminar
                      </button>
                    )}
                  </div>
                  <input className={styles.inputStyle} value={exp.company} onChange={(e) => handleExpChange(index, 'company', e.target.value)} placeholder="Empresa" />
                  <input className={styles.inputStyle} value={exp.role} onChange={(e) => handleExpChange(index, 'role', e.target.value)} placeholder="Cargo / Rol" />
                </div>
              ))}

              <button onClick={addExperience} style={{background: 'transparent', border: '1px dashed #2D3333', color: '#AFA595', padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'}}>
                + Añadir otra experiencia
              </button>
              
              <button className={styles.premiumBtn} onClick={saveVerifiedData} style={{marginTop: '10px'}}>Confirmar Datos</button>
              <button className={styles.secondaryBtn} onClick={() => setShowVerifyForm(false)} style={{border: 'none'}}>Omitir por ahora</button>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)}>
          {selectedJob && <JobDetailContent job={selectedJob} onClose={() => setSelectedJob(null)} />}
      </Modal>
    </>
  );
}