import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface CelebrationEffectProps {
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

/**
 * A component that shows a celebration animation when a todo is completed
 */
const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
  message = "Task completed! 🎉",
  duration = 3000,
  onComplete
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!visible) return null;

  // Generate random confetti particles
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    size: Math.random() * 8 + 5
  }));

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999,
        overflow: 'hidden'
      }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        setVisible(false);
        if (onComplete) onComplete();
      }}
    >
      {particles.map(particle => (
        <Box
          key={particle.id}
          component={motion.div}
          sx={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            backgroundColor: [
              '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
            ][Math.floor(Math.random() * 6)],
            pointerEvents: 'none'
          }}
          initial={{ 
            x: `${particle.x}vw`, 
            y: -20,
            opacity: 1
          }}
          animate={{ 
            y: '100vh',
            opacity: 0,
            rotate: Math.random() * 360
          }}
          transition={{ 
            duration: Math.random() * 2 + 2,
            delay: particle.delay,
            ease: 'easeOut' 
          }}
        />
      ))}

      <Box
        component={motion.div}
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          padding: 4,
          textAlign: 'center',
          maxWidth: '80%',
          boxShadow: 3
        }}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 12 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {message}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          You're making great progress! Keep it up!
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            setVisible(false);
            if (onComplete) onComplete();
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default CelebrationEffect; 