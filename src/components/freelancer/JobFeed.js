'use client';
import { useEffect, useState } from 'react';
// IMPORTANTE: Ajustamos la ruta con ../../ porque ahora estamos dentro de carpetas
import { supabase } from '../../lib/supabaseClient'; 
import JobCard from './JobCard'; 
import JobModal from '../ui/JobModal'; // Asumiendo que JobModal está en components/ui

export default function JobFeed() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data, error } = await supabase
          .from('job_postings')
          .select(`
            id,
            title,
            description,
            budget_max,
            created_at,
            status,
            companies ( 
              commercial_name, 
              logo_url,
              cities ( name ) 
            ),
            job_skills (
              skills ( name )
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (err) {
        console.error("Error:", err.message);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  // Renderizamos SOLO la parte de la lista y el modal
  return (
    <div>
      {errorMsg && (
        <div style={{ padding: '15px', background: '#FEE2E2', color: '#991B1B', borderRadius: '8px', marginBottom: '20px' }}>
          Error: {errorMsg}
        </div>
      )}

      {loading ? (
        <p>Cargando ofertas...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onClick={(jobData) => setSelectedJob(jobData)} 
            />
          ))}
        </div>
      )}

      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} session={session} />
    </div>
  );
}