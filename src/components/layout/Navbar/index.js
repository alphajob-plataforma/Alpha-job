'use client'; // Necesario para usar useState

import { useState } from 'react';
import Link from 'next/link';
import { Box, Menu, X } from 'lucide-react'; // Importamos iconos de menú
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* --- LOGO (Visible siempre) --- */}
        <Link href="/" className={styles.brand}>
          <Box className="text-mint" size={28} strokeWidth={2.5} />
          <h2 className={styles.brandName}>ChambexCity</h2>
        </Link>

        {/* --- NAV DESKTOP (Centrado Absoluto) --- */}
        <nav className={styles.navDesktop}>
          <Link href="/" className={styles.link}>Inicio</Link>
          <Link href="/about" className={`${styles.link} `}>Sobre Nosotros</Link>
          <Link href="/jobs" className={styles.link}>Ofertas</Link>
          <Link href="/challenges" className={styles.link}>Desafíos</Link>
          <Link href="/ClientesRecomendados" className={styles.link}>Clientes Recomendados</Link>
        </nav>

        {/* --- BOTONES DESKTOP (Derecha) --- */}
        <div className={styles.authGroupDesktop}>
          <Link href="/login" onClick={toggleMenu} className={styles.btnLogin}>Iniciar Sesión</Link>
          <Link href="/register" onClick={toggleMenu} className={styles.btnRegister}>Registrarse</Link>
        </div>

        {/* --- BOTÓN HAMBURGUESA (Solo Móvil) --- */}
        <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Menu">
          {isOpen ? <X size={28} color="#fff" /> : <Menu size={28} color="#fff" />}
        </button>

      </div>

      {/* --- MENÚ MÓVIL (Overlay) --- */}
      {/* Usamos una clase condicional para mostrarlo u ocultarlo */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.menuOpen : ''}`}>
        <div className={styles.mobileLinks}>
          <Link href="/" onClick={toggleMenu} className={styles.mobileLink}>Inicio</Link>
          <Link href="/about" onClick={toggleMenu} className={styles.mobileLink}>Sobre Nosotros</Link>
          <Link href="/jobs" onClick={toggleMenu} className={styles.mobileLink}>Ofertas</Link>
        </div>
        <div className={styles.mobileAuth}>
          <Link href="/login" onClick={toggleMenu} className={styles.btnLogin}>Iniciar Sesión</Link>
          <Link href="/register" onClick={toggleMenu} className={styles.btnRegister} style={{width: '100%'}}>Registrarse</Link>
        </div>
      </div>
    </header>
  );
}