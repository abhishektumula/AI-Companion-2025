import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full bg-black/50 backdrop-blur-md z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Swords className="w-8 h-8 text-[var(--loki-green)]" />
          <span className="text-2xl font-bold text-white">Loki<span className="text-[var(--loki-green)]">AI</span></span>
        </Link>
        
        <div className="flex items-center space-x-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <button
            onClick={() => navigate('/login')}
            className="loki-button"
          >
            Get Started
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;