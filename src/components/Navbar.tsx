import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Menu, X, LogOut, LayoutDashboard, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/src/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === 'admin');
        }
      } else {
        setIsAdmin(false);
      }
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-4' : 'py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass rounded-3xl px-6 py-3 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'bg-black/40 border-white/5' : 'bg-white/5 border-white/10'
        }`}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-2.5 rounded-xl group-hover:rotate-[15deg] transition-transform duration-500 shadow-lg shadow-blue-600/20">
              <Scissors className="text-white w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tighter text-white">
              FORTUNE <span className="text-blue-500">BARBER</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  location.pathname === link.path 
                    ? 'text-white bg-white/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/ai-preview">
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-xl gap-2 font-bold">
                    <Sparkles className="w-4 h-4" />
                    AI PREVIEW
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl gap-2 font-bold">
                      <LayoutDashboard className="w-4 h-4" />
                      ADMIN
                    </Button>
                  </Link>
                )}
                <div className="w-px h-6 bg-white/10 mx-2" />
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl p-2"
                  onClick={() => signOut(auth)}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white px-4">Login</Link>
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-blue-600/20">
                    JOIN COMMUNITY
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-full left-0 right-0 px-6 mt-4"
          >
            <div className="glass-dark rounded-[2rem] p-8 flex flex-col gap-6 shadow-3xl border-white/10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-bold transition-colors ${
                    location.pathname === link.path ? 'text-blue-500' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {user ? (
                <div className="space-y-4">
                  <Link to="/ai-preview" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-xl font-bold text-blue-400">
                    <Sparkles className="w-6 h-6" /> AI Hairstyle Preview
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-xl font-bold text-gray-300">
                      <LayoutDashboard className="w-6 h-6" /> Admin Dashboard
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full border-white/10 text-white rounded-2xl py-6 font-bold"
                    onClick={() => {
                      signOut(auth);
                      setIsOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-white/10 text-white rounded-2xl py-6 font-bold">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-blue-600 rounded-2xl py-6 font-bold">Join Community</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
