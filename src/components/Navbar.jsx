import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ currentTheme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  const location = useLocation(); // Get current route

  const toggleTheme = (theme) => {
    setTheme(theme);
    setShowThemeMenu(false);
    setIsOpen(false); 
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Education', path: '/education' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  // Animation Variants for Mobile Menu
  const menuVariants = {
    hidden: { opacity: 0, scale: 0.5, x: 100, y: -50 },
    visible: { opacity: 1, scale: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.5, x: 100, y: -50, transition: { duration: 0.2 } }
  };

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300 py-4">
      <nav className="max-w-[90%] mx-auto flex justify-between items-center 
                      backdrop-blur-md bg-bg/80 border border-white/5 
                      rounded-2xl px-6 py-3 shadow-lg relative z-50">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-text font-heading font-bold text-2xl tracking-tighter">
          <img src="/img/perfil.jpg" alt="Profile" className="w-8 h-8 rounded-full border border-primary" />
          Ahmed <span className="text-primary">Sakil</span>
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <ul className="hidden md:flex gap-8 items-center">
          {navLinks.map((item) => (
            <li key={item.name} className="relative">
              <Link 
                to={item.path} 
                className={`transition font-medium text-sm tracking-wide ${
                  isActive(item.path) 
                    ? "text-primary font-bold shadow-[0_0_10px_rgba(0,224,167,0.2)]" // Active Style
                    : "text-text hover:text-primary" // Inactive Style
                }`}
              >
                {item.name}
                
                {/* Active Indicator Dot (Optional Visual Flair) */}
                {isActive(item.path) && (
                  <motion.span 
                    layoutId="activeDot"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_currentColor]"
                  />
                )}
              </Link>
            </li>
          ))}
          
          {/* Theme Switcher */}
          <div className="relative ml-2">
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="text-text hover:text-primary transition text-xl flex items-center"
            >
              <i className="ri-palette-line"></i>
            </button>

            <AnimatePresence>
              {showThemeMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-4 bg-bg border border-white/10 rounded-lg shadow-xl p-2 w-32 flex flex-col gap-2"
                >
                  <button onClick={() => toggleTheme('default')} className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded text-sm text-text">
                    <span className="w-3 h-3 rounded-full bg-[#00e0a7]"></span> Cyan
                  </button>
                  <button onClick={() => toggleTheme('red')} className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded text-sm text-text">
                    <span className="w-3 h-3 rounded-full bg-[#ff2e63]"></span> Crimson
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ul>

        {/* ================= MOBILE TOGGLE ================= */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            className="text-2xl cursor-pointer text-text hover:text-primary transition" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={isOpen ? "ri-close-line" : "ri-menu-line"}></i>
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU DROPDOWN ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-20 right-[5%] w-[90%] md:hidden origin-top-right z-40"
          >
            <div className="bg-bg/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
              
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  onClick={() => setIsOpen(false)}
                  className={`
                    text-lg font-medium transition border-b border-white/5 pb-2 last:border-0
                    ${isActive(item.path) ? "text-primary pl-2 border-l-2 border-primary" : "text-text hover:text-primary"}
                  `}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-white/10 pt-4 mt-2">
                <span className="text-sm text-text-muted mb-3 block">Select Theme</span>
                <div className="flex gap-4">
                  <button 
                    onClick={() => toggleTheme('default')} 
                    className={`flex-1 py-2 rounded-lg border border-white/10 flex items-center justify-center gap-2 transition ${currentTheme === 'default' ? 'bg-primary/20 border-primary' : 'bg-white/5'}`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#00e0a7]"></span> Cyan
                  </button>
                  <button 
                    onClick={() => toggleTheme('red')} 
                    className={`flex-1 py-2 rounded-lg border border-white/10 flex items-center justify-center gap-2 transition ${currentTheme === 'red' ? 'bg-primary/20 border-primary' : 'bg-white/5'}`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#ff2e63]"></span> Red
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;