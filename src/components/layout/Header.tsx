import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [clickCount, setClickCount] = useState(0);
  const [showEgg, setShowEgg] = useState(false);
  const isScrolled = useUIStore((state) => state.isScrolled);
  const { isDark, toggleTheme } = useTheme();

  const isHome = location.pathname === '/';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (clickCount > 0 && clickCount < 5) {
      timer = setTimeout(() => setClickCount(0), 1000);
    } else if (clickCount >= 5) {
      setShowEgg(true);
      setClickCount(0);
      setTimeout(() => setShowEgg(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [clickCount]);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
  };

  const navItems = [
    { name: '工具', path: '/' },
    { name: '笔记', path: '/notes' },
    { name: '碎碎念', path: '/mutter' },
    { name: '我的', path: '/dashboard' },
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isHome && !isScrolled 
          ? "bg-transparent border-transparent text-white" 
          : "bg-background/95 backdrop-blur border-b text-foreground"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div 
          className="flex items-center gap-2 font-bold text-xl cursor-pointer select-none"
          onClick={handleLogoClick}
        >
          {/* Logo Animation Container */}
          <div className="relative h-8 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              {(!isHome || isScrolled) ? (
                 // Scrolled State: Frog Icon
                 <motion.div
                   key="frog-logo"
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   exit={{ x: -20, opacity: 0 }}
                   transition={{ duration: 0.3, ease: "easeOut" }}
                   className="flex items-center"
                 >
                   <span className="text-2xl mr-2">🐸</span>
                 </motion.div>
              ) : (
                 // Initial State: Text Logo
                <motion.span
                  key="text-logo"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                >
                  Jelly-Frog
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className="flex items-center gap-6 relative">
          <div className="flex items-center gap-6 overflow-hidden py-2">
            <AnimatePresence mode="popLayout">
              {navItems.map((item) => (
                <motion.div 
                  key={item.path} 
                  layout="position"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] whitespace-nowrap",
                      location.pathname === item.path 
                        ? (isHome && !isScrolled ? "text-white font-bold" : "text-primary drop-shadow-none")
                        : (isHome && !isScrolled ? "text-white hover:text-white" : "text-muted-foreground drop-shadow-none")
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Avatar Docked in Header - Moved outside overflow-hidden container */}
          <AnimatePresence>
            {(!isHome || isScrolled) && (
              <motion.div 
                key="header-avatar"
                layoutId="avatar-container"
                className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 bg-background flex-shrink-0"
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ borderRadius: '9999px', originX: 0, originY: 0 }}
              >
                  <motion.img 
                    src="/avatar.png"
                    onError={(e) => e.currentTarget.src = "https://ui-avatars.com/api/?name=Keroppi&background=8bc34a&color=fff"}
                    alt="User" 
                    className="w-full h-full object-cover block" 
                  />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-full transition-colors hover:bg-muted/20 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
              isHome && !isScrolled ? "text-white hover:text-white" : "text-muted-foreground hover:text-foreground drop-shadow-none"
            )}
            aria-label="Toggle theme"
          >
            {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </nav>
      </div>
      
      {/* Egg Animation Overlay */}
      {showEgg && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center bg-black/50">
          <div className="text-white text-4xl font-bold animate-bounce">
            ⚡ 三相正弦波启动！ ⚡
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
