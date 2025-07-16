import React, { useState, useEffect } from 'react';
import { Home, Search, ArrowLeft, Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Modern404Page = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [particles, setParticles] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
    }));
    setParticles(newParticles);

    // Periodic glitch effect
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleConnectionToggle = () => {
    setConnectionStatus(prev => prev === 'connected' ? 'disconnected' : 'connected');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const glitchVariants = {
    normal: { x: 0, textShadow: 'none' },
    glitch: {
      x: [-2, 2, -2, 2, 0],
      textShadow: [
        '2px 0 #ff0000, -2px 0 #00ffff',
        '-2px 0 #ff0000, 2px 0 #00ffff',
        '2px 0 #ff0000, -2px 0 #00ffff',
        '-2px 0 #ff0000, 2px 0 #00ffff',
        'none'
      ],
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-purple-400 rounded-full opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}

      {/* Main content container */}
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Connection status indicator */}
        <motion.div
          className="absolute top-8 right-8 flex items-center space-x-2"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleConnectionToggle}
            className={`p-2 rounded-full transition-colors ${
              connectionStatus === 'connected' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {connectionStatus === 'connected' ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
          </motion.button>
          <span className="text-sm">
            {connectionStatus === 'connected' ? 'Online' : 'Offline'}
          </span>
        </motion.div>

        {/* Error icon with animation */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <AlertTriangle className="w-24 h-24 text-purple-400" />
        </motion.div>

        {/* 404 Number with glitch effect */}
        <motion.div
          className="text-center mb-8"
          variants={glitchVariants}
          animate={isGlitching ? 'glitch' : 'normal'}
        >
          <motion.h1
            className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
            variants={itemVariants}
          >
            404
          </motion.h1>
          <motion.div
            className="h-1 w-32 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"
            variants={itemVariants}
            animate={{
              scaleX: [1, 0.8, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </motion.div>

        {/* Error message */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            The page you're looking for seems to have vanished into the digital void. 
            Let's get you back on track.
          </p>
        </motion.div>

        {/* Action buttons */}
         <Link to={'/'}>
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 w-[60vw] lg:w-[50vw] lg:max-w-full "
          variants={itemVariants}
        >
          <motion.button
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95"
            whileHover={{ 
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </motion.button>
        </motion.div>
       </Link>

        {/* Back button */}
        <motion.button
          className="flex items-center space-x-2 mt-8 text-gray-400 hover:text-white transition-colors"
          variants={itemVariants}
          whileHover={{ x: -5 }}
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </motion.button>

        {/* Floating refresh button */}
        <motion.button
          className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 p-4 rounded-full shadow-lg transition-all"
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 0 25px rgba(168, 85, 247, 0.5)' 
          }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: 360 }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: 'linear' }
          }}
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-4 h-full p-8">
          {Array.from({ length: 48 }, (_, i) => (
            <motion.div
              key={i}
              className="bg-purple-400 rounded"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modern404Page;