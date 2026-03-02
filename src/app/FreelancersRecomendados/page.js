'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Filter, Star, Briefcase, DollarSign, X, Zap, CheckCircle } from 'lucide-react';
import styles from './ClientesRecomendados.module.css';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Config Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Page() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Estado del Modal
  const [selectedUser, setSelectedUser] = useState(null); // Guarda el objeto usuario seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      // 1. JOIN COMPLEJO: Traemos freelancers + Título + SKILLS
      const { data, error } = await supabase
        .from('freelancers')
        .select(`
          *,
          job_titles ( name ),
          freelancer_skills (
            skills ( name )
          )
        `)
        .limit(1000);

      if (error) throw error;

      if (data) {
        // Aplanamos la estructura de skills para que sea más fácil de usar
        // De: freelancer_skills: [{ skills: {name: 'Java'} }, ...]
        // A:  skillList: ['Java', 'Spring', 'React']
        const processedData = data.map(user => ({
          ...user,
          skillList: user.freelancer_skills?.map(fs => fs.skills?.name).filter(Boolean) || []
        }));

        setFreelancers(processedData);

        const uniqueCats = [...new Set(processedData.map(f => f.job_titles?.name).filter(Boolean))];
        setCategories(uniqueCats.sort());
      }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE BÚSQUEDA AVANZADA ---
  const filteredFreelancers = freelancers.filter(user => {
    // Texto a buscar (en minúsculas)
    const term = searchTerm.toLowerCase();
    
    // Datos del usuario
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const jobTitle = user.job_titles?.name?.toLowerCase() || '';
    
    // Verificar si el término está en Nombre O en Título O en ALGÚN Skill
    const matchesSearch = 
      fullName.includes(term) || 
      jobTitle.includes(term) || 
      user.skillList.some(skill => skill.toLowerCase().includes(term));
    
    // Filtro por categoría (dropdown)
    const matchesCategory = selectedCategory === 'Todos' || user.job_titles?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Helpers Visuales
  const getInitials = (name, lastName) => `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  const getAvatarClass = (name) => styles[`color${((name?.length || 0) % 6) + 1}`];

  // Manejadores del Modal
  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    // Bloquear scroll del fondo
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    // Reactivar scroll
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className={styles.mainWrapper}>
        <div className={styles.innerContainer}>
          
          <div className={styles.header}>
            <h1 className={styles.title}>
              Talento <span className={styles.highlight}>Verificado</span>
            </h1>
            <p className={styles.subtitle}>
              Busca por nombre, profesión o habilidad técnica.
            </p>
          </div>

          <div className={styles.filterBar}>
            <div className={styles.inputGroup}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder="Buscar: 'Python', 'Diseñador', 'Mafer'..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup} style={{ maxWidth: '300px' }}>
              <Filter className={styles.filterIcon} />
              <select
                className={styles.select}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="Todos">Todas las áreas</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.stats}>
              <strong>{filteredFreelancers.length}</strong> Resultados
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              Cargando talento...
            </div>
          ) : filteredFreelancers.length > 0 ? (
            <div className={styles.grid}>
              {filteredFreelancers.map((user) => (
                <div key={user.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={`${styles.avatar} ${getAvatarClass(user.first_name)}`}>
                      {getInitials(user.first_name, user.last_name)}
                    </div>
                    <div className={styles.info}>
                      <h3 className={styles.name}>{user.first_name} {user.last_name}</h3>
                      <div className={styles.jobTitle}>
                        <Briefcase size={14} />
                        {user.job_titles?.name || 'Freelancer'}
                      </div>
                      
                    </div>
                  </div>

                  <div className={styles.bio}>
                    {user.bio || 'Sin descripción disponible.'}
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.rate}>
                      <DollarSign size={16} className="text-gray-400" />
                      {user.hourly_rate}/hr
                    </div>
                    {/* Botón abre el Modal */}
                    <button 
                      className={styles.profileBtn}
                      onClick={() => openModal(user)}
                    >
                      Ver Perfil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              No encontramos coincidencias para "{searchTerm}".
            </div>
          )}

        </div>
      </main>

      {/* --- MODAL DE PERFIL --- */}
      {isModalOpen && selectedUser && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={`${styles.modalAvatar} ${getAvatarClass(selectedUser.first_name)}`}>
                {getInitials(selectedUser.first_name, selectedUser.last_name)}
              </div>
              <div className={styles.modalTitle}>
                <h2>{selectedUser.first_name} {selectedUser.last_name}</h2>
                <span>{selectedUser.job_titles?.name}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              <div className={styles.sectionTitle}>
                <CheckCircle size={16} /> Sobre mí
              </div>
              <p className={styles.modalBio}>
                {selectedUser.bio || "Este freelancer no ha agregado una biografía aún, pero sus habilidades hablan por sí mismas."}
              </p>

              {selectedUser.skillList && selectedUser.skillList.length > 0 && (
                <>
                  <div className={styles.sectionTitle}>
                    <Zap size={16} /> Habilidades & Herramientas
                  </div>
                  <div className={styles.skillsGrid}>
                    {selectedUser.skillList.map((skill, idx) => (
                      <span key={idx} className={styles.skillChip}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              <div className={styles.modalRate}>
                <span className={styles.rateLabel}>Tarifa por hora</span>
                <span className={styles.rateAmount}>${selectedUser.hourly_rate}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}