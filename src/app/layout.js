// src/app/layout.js
import '../styles/globals.css'; // Importamos los estilos globales aquí


export const metadata = {
  title: 'Alpha Job',
  description: 'Plataforma de empleos para freelancers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}