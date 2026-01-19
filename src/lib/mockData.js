export const jobsData = [
  {
    // Datos de la tabla job_postings
    id: "uuid-1",
    title: "Rediseño de Identidad Visual Corporativa",
    description: "Necesitamos modernizar nuestro logotipo y guía de estilos. Buscamos un diseñador con portafolio minimalista y experiencia en branding B2B.",
    budget_max: 800,
    currency: "USD",
    status: "open",
    
    // Datos unidos de la tabla companies
    company: {
      commercial_name: "Studio Creativo Alpha",
      city: "Madrid, ES", // Simulado (city_id -> cities table)
      logo_url: "/placeholder-icon.png" 
    },

    // Datos unidos de job_skills y skills
    skills: ["Diseño Gráfico", "Branding"]
  },
  {
    id: "uuid-2",
    title: "Desarrollador Full Stack React/Node",
    description: "Buscamos experto para migración de base de datos y refactorización de frontend.",
    budget_max: 1200,
    currency: "USD",
    status: "open",
    company: {
      commercial_name: "Tech Solutions",
      city: "Remoto",
      logo_url: null
    },
    skills: ["React", "PostgreSQL", "Node.js"]
  }
];