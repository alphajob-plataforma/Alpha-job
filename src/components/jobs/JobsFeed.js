'use client';
import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react'; // Icono para botón móvil
import JobCard from '../ui/JobCard';
import Modal from '../ui/Modal';
import JobDetailContent from './JobDetailContent';
import JobSearch from './JobSearch';
import JobFilters from './JobFilters';

export default function JobsFeed({ jobs = [] }) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false); // Estado para móvil

  // Estado de los Filtros
  const [filters, setFilters] = useState({
    categories: [],
    types: [],
    locations: [],
    budget: null
  });

  // 1. Generar lista de sugerencias para el Buscador (Autocomplete)
  const allTerms = useMemo(() => {
    const termsSet = new Set();
    jobs.forEach(job => {
      if (job.title) termsSet.add(job.title);
      if (job.companies?.commercial_name) termsSet.add(job.companies.commercial_name);
      job.job_skills?.forEach(js => { if (js.skills?.name) termsSet.add(js.skills.name) });
    });
    return Array.from(termsSet);
  }, [jobs]);

  // 2. Lógica Maestra de Filtrado
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // --- Lógica de Categoría Virtual (Porque no viene de DB explícitamente) ---
      let jobCat = 'Otros';
      const t = job.title?.toLowerCase() || '';
      if (t.includes('design') || t.includes('diseñ') || t.includes('ui')) jobCat = 'Diseño UI/UX';
      else if (t.includes('dev') || t.includes('web') || t.includes('full') || t.includes('front') || t.includes('back')) jobCat = 'Desarrollo Web';
      else if (t.includes('marketing') || t.includes('seo')) jobCat = 'Marketing Digital';
      else if (t.includes('data')) jobCat = 'Data Science';
      
      // A. Categoría
      const matchCat = filters.categories.length === 0 || filters.categories.includes(jobCat);

      // B. Buscador Texto
      const lowerQuery = searchQuery.toLowerCase();
      const matchSearch = !searchQuery || (
        job.title?.toLowerCase().includes(lowerQuery) ||
        job.companies?.commercial_name?.toLowerCase().includes(lowerQuery) ||
        job.job_skills?.some(js => js.skills?.name?.toLowerCase().includes(lowerQuery))
      );

      // C. Tipos (Full-time, etc)
      const matchType = filters.types.length === 0 || filters.types.includes(job.employment_type);

      // D. Ubicación
      const jobLoc = job.companies?.city_id ? 'Híbrido / Presencial' : 'Remoto';
      const matchLoc = filters.locations.length === 0 || filters.locations.includes(jobLoc);

      // E. Presupuesto
      let matchBudget = true;
      if (filters.budget) {
        const max = job.budget_max || 0;
        if (filters.budget === '$500 - $1,500') matchBudget = max >= 500 && max <= 1500;
        else if (filters.budget === '$1,500 - $5,000') matchBudget = max > 1500 && max <= 5000;
        else if (filters.budget === '$5,000+') matchBudget = max > 5000;
      }

      return matchCat && matchSearch && matchType && matchLoc && matchBudget;
    });
  }, [jobs, searchQuery, filters]);

  return (
    <>
      {/* 1. BUSCADOR SUPERIOR */}
      <JobSearch onSearch={setSearchQuery} suggestionsList={allTerms} />

      {/* Botón Toggle Filtros (Solo visible en Móvil) */}
      <div className="lg:hidden mt-4 mb-2">
        <button 
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="flex items-center gap-2 text-[#7ADCB7] border border-[#2a2e2e] bg-[#1c1f1f] px-4 py-2 rounded-full text-sm font-bold"
        >
          <Filter size={16} />
          {showFiltersMobile ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
      </div>

      {/* 2. LAYOUT PRINCIPAL (Sidebar + Feed) */}
      <div className="flex flex-col lg:flex-row gap-8 mt-6 items-start relative">
        
        <aside className={`
          w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-4 
          ${showFiltersMobile ? 'block' : 'hidden lg:block'}
        `}>
          <JobFilters 
            jobs={jobs} 
            currentFilters={filters}
            onFilterChange={setFilters}
          />
        </aside>

        {/* --- DERECHA: LISTA DE TARJETAS --- */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Header Resultados */}
          <div className="flex justify-between items-center mb-4 px-1">
             <span className="text-[#AFA595] text-sm font-medium">
               Encontramos <span className="text-white font-bold">{filteredJobs.length}</span> ofertas activas
             </span>
          </div>

          <div className="flex flex-col gap-4">
             {filteredJobs.length > 0 ? (
               filteredJobs.map(job => (
                  <div key={job.id} onClick={(e) => { e.preventDefault(); setSelectedJob(job); }}>
                     <JobCard job={job} />
                  </div>
               ))
             ) : (
               // Estado Vacío (Empty State)
               <div className="py-16 text-center border border-dashed border-[#2a2e2e] rounded-xl bg-[#1c1f1f]/30">
                 <p className="text-xl text-[#AFA595] font-medium">No se encontraron resultados</p>
                 <p className="text-sm mt-2 text-white/40 mb-4">Intenta ajustar los filtros o buscar términos más generales.</p>
                 <button 
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({ categories: [], types: [], locations: [], budget: null });
                    }}
                    className="text-[#7ADCB7] hover:underline"
                 >
                   Limpiar todos los filtros
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* 3. MODAL DE DETALLE */}
      <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)}>
        {selectedJob && <JobDetailContent job={selectedJob} onClose={() => setSelectedJob(null)} />}
      </Modal>
    </>
  );
}