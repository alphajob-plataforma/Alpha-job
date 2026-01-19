'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
// IMPORTANTE: Importación del CSS Module
import styles from './challenges.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Iconos SVG simples
const Icons = {
    Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    Code: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    Trophy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
};

export default function ChallengesPage() {
    const router = useRouter();
    const [view, setView] = useState('list');
    
    // Estados
    const [challenges, setChallenges] = useState([]);
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); 
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    // Carga inicial
    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const { data } = await supabase.from('challenges').select(`id, title, description, difficulty`);
                if (data) setChallenges(data);
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        fetchChallenges();
    }, []);

    // Lógica del Quiz
    const startChallenge = async (challenge) => {
        setLoading(true);
        setCurrentChallenge(challenge);
        const { data: qData } = await supabase.from('challenge_questions')
            .select(`id, question_text, points, challenge_options (id, option_text)`)
            .eq('challenge_id', challenge.id).order('order_index', { ascending: true });

        if (qData && qData.length > 0) {
            setQuestions(qData); setView('quiz'); setCurrentQIndex(0); setAnswers({}); setScore(0);
        } else { alert("Desafío en construcción."); }
        setLoading(false);
    };

    const handleOptionSelect = (qId, optionId) => setAnswers(prev => ({ ...prev, [qId]: optionId }));
    const handleNext = () => currentQIndex < questions.length - 1 ? setCurrentQIndex(prev => prev + 1) : calculateScore();

    const calculateScore = async () => {
        setLoading(true);
        const { data: correctData } = await supabase.from('challenge_options')
            .select('id, question_id, points:challenge_questions(points)')
            .eq('is_correct', true).in('question_id', questions.map(q => q.id));

        let totalScore = 0;
        if (correctData) {
            questions.forEach(q => {
                const userAnsId = answers[q.id];
                const correctOption = correctData.find(c => c.question_id === q.id);
                if (correctOption?.id === userAnsId) totalScore += 10;
            });
        }
        setScore(totalScore); setView('results'); setLoading(false);
    };

    const handleSaveAndLogin = () => {
        if (!currentChallenge) return;
        const attemptData = { challengeId: currentChallenge.id, score: score, timestamp: new Date().toISOString() };
        if (typeof window !== 'undefined') {
            localStorage.setItem('pending_challenge_result', JSON.stringify(attemptData));
            router.push('/login?trigger=challenge_completed');
        }
    };

    const activeQuestion = questions[currentQIndex];

    return (
        // Usamos styles.container en lugar de "challenges-page"
        <div className={styles.container}>
            <Navbar />
        
            <div className={styles.wrapper}>
                
                {/* HERO Y STATS (Solo en lista) */}
                {view === 'list' && (
                    <>
                        <div className={styles.heroSection}>
                            <span className={styles.heroTag}>Desafíos Profesionales</span>
                            <h1 className={styles.heroTitle}>Demuestra tu talento al mundo</h1>
                            <p className={styles.heroSubtitle}>
                                Completa evaluaciones técnicas, obtén insignias verificadas y destaca ante las mejores empresas globales.
                            </p>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{challenges.length}</span>
                                <span className={styles.statLabel}>Desafíos Activos</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>100+</span>
                                <span className={styles.statLabel}>Usuarios Certificados</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>85%</span>
                                <span className={styles.statLabel}>Tasa de Contratación</span>
                            </div>
                        </div>
                    </>
                )}

                {loading && <div style={{textAlign:'center', padding:'50px'}}>Cargando...</div>}

                {/* --- GRID DE TARJETAS --- */}
                {!loading && view === 'list' && (
                    <div className={styles.grid}>
                        {challenges.map(ch => (
                            <div key={ch.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconBox}>
                                        <Icons.Code />
                                    </div>
                                    <div className={styles.cardTitleGroup}>
                                        <h3 className={styles.cardTitle}>{ch.title}</h3>
                                        <span className={styles.cardCategory}>Tecnología</span>
                                    </div>
                                </div>

                                <p className={styles.cardDesc}>{ch.description || 'Evalúa tus conocimientos técnicos.'}</p>

                                <div className={styles.tagsWrapper}>
                                    <span className={styles.tag}>Oficial</span>
                                    <span className={styles.tag}>{ch.difficulty}</span>
                                </div>

                                <div className={styles.cardFooter}>
                                    <div className={styles.cardMeta}>
                                        <div className={styles.metaItem}><Icons.Clock /> 15m</div>
                                    </div>
                                    <button onClick={() => startChallenge(ch)} className={styles.btnStart}>
                                        Iniciar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                

                {/* --- VISTA QUIZ MEJORADA --- */}
                {!loading && view === 'quiz' && activeQuestion && (
                    <div className={styles.quizWrapper}>
                        
                        <div className={styles.quizCard}>
                            {/* Barra de Progreso */}
                            <div className={styles.progressContainer}>
                                <div className={styles.progressLabel}>
                                    <span>Pregunta {currentQIndex + 1} de {questions.length}</span>
                                    <span>{Math.round(((currentQIndex + 1) / questions.length) * 100)}% Completado</span>
                                </div>
                                <div className={styles.progressBarTrack}>
                                    <div 
                                        className={styles.progressBarFill} 
                                        style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Pregunta */}
                            <h2 className={styles.questionText}>
                                {activeQuestion.question_text}
                            </h2>
                            
                            {/* Opciones */}
                            <div className={styles.optionsList}>
                                {activeQuestion.challenge_options?.map(opt => {
                                    const isSelected = answers[activeQuestion.id] === opt.id;
                                    return (
                                        <button 
                                            key={opt.id}
                                            onClick={() => handleOptionSelect(activeQuestion.id, opt.id)}
                                            className={isSelected ? styles.optionSelected : styles.optionButton}
                                        >
                                            {/* Círculo decorativo tipo Radio Button */}
                                            <div className={styles.optionCircle}></div>
                                            {opt.option_text}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Botón Siguiente */}
                            <div className={styles.quizFooter}>
                                <button onClick={handleNext} className={styles.btnStart}>
                                    {currentQIndex === questions.length - 1 ? 'Finalizar Test' : 'Siguiente Pregunta'}
                                </button>
                            </div>
                        </div>

                        {/* Botón sutil para cancelar/salir */}
                        <div style={{textAlign: 'center', marginTop: '20px'}}>
                            <button 
                                onClick={() => setView('list')} 
                                style={{background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem'}}
                            >
                                Cancelar y salir
                            </button>
                        </div>
                    </div>
                    
                )}
                {/* --- VISTA RESULTADOS --- */}
                {!loading && view === 'results' && (
                    <div className={styles.resultsCard}>
                        <h2 style={{fontSize:'2.5rem', color:'var(--primary-mint)', fontWeight:'bold', marginBottom:'10px'}}>Resultados</h2>
                        <div style={{fontSize:'5rem', fontWeight:'900', color:'white', lineHeight:'1'}}>{score}</div>
                        <p style={{color:'var(--text-beige)', margin:'20px 0'}}>Puntos Totales</p>
                        
                        <button onClick={handleSaveAndLogin} className={styles.btnStart} style={{width:'100%', padding:'15px', marginTop:'20px'}}>
                            Guardar Progreso
                        </button>
                        <button onClick={() => setView('list')} style={{marginTop:'20px', background:'transparent', color:'var(--text-beige)', border:'none', cursor:'pointer', textDecoration:'underline'}}>
                            Volver al menú
                        </button>
                    </div>
                )}
                
                 <Footer />
            </div>
            
        </div>
        
       
    );
}