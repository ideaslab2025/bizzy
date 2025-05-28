
import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ active, duration = 3000 }) => {
  const [showConfetti, setShowConfetti] = useState(active);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    delay: number;
  }>>([]);

  useEffect(() => {
    setShowConfetti(active);
    if (active) {
      // Generate particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: ['#0088cc', '#00a6ff', '#FFD700', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 2
      }));
      setParticles(newParticles);

      if (duration) {
        const timer = setTimeout(() => setShowConfetti(false), duration);
        return () => clearTimeout(timer);
      }
    }
  }, [active, duration]);

  if (!showConfetti) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 animate-bounce"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: '3s',
            transform: 'translateY(100vh)'
          }}
        />
      ))}
    </div>
  );
};
