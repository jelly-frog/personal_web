import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';

const Header = () => {
  const location = useLocation();
  const [clickCount, setClickCount] = useState(0);
  const [showEgg, setShowEgg] = useState(false);
  const isScrolled = useUIStore((state) => state.isScrolled);

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
                   className="flex items-center"
                 >
                   <span className="text-2xl mr-2">🐸</span>
                 </motion.div>
              ) : (
                 // Initial State: Text Logo
                 <motion.span
                   key="text-logo"
                   initial={{ x: 20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   exit={{ x: -20, opacity: 0 }}
                   className="text-white"
                 >
                   Jelly-Frog
                 </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <div key={item.path} className="flex items-center gap-2">
              <Link
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path 
                    ? (isHome && !isScrolled ? "text-white font-bold" : "text-primary")
                    : (isHome && !isScrolled ? "text-white/80" : "text-muted-foreground")
                )}
              >
                {item.name}
              </Link>
              
              {/* Avatar Docked in Header */}
              {item.name === '我的' && (
                (!isHome || isScrolled) && (
                  <motion.div 
                    layoutId="avatar-container"
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                     <motion.img 
                       layoutId="avatar-img"
                       src="/avatar.png"
                       onError={(e) => e.currentTarget.src = "https://ui-avatars.com/api/?name=Keroppi&background=8bc34a&color=fff"}
                       alt="User" 
                       className="w-full h-full object-cover" 
                     />
                  </motion.div>
                )
              )}
            </div>
          ))}
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
