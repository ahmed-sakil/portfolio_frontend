// frontend/src/components/Layout.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';

const Layout = () => {
  const [theme, setTheme] = useState('default');

  // When theme changes, update CSS variable for Tailwind
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'red') {
      root.setAttribute('data-theme', 'red');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  return (
    <div className="relative min-h-screen flex flex-col font-body text-text">
      {/* 1. Permanent Background (Receives Theme Prop) */}
      <ParticleBackground theme={theme} />

      {/* 2. Permanent Navbar (Receives functions to change Theme) */}
      <Navbar currentTheme={theme} setTheme={setTheme} />

      {/* 3. Page Content */}
      <main className="flex-grow pt-24 px-4 relative z-10">
        <Outlet />
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
};

export default Layout;