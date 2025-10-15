import React, { useCallback, useEffect, useRef, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const ParticleEffect = ({ trigger }) => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    if (container && !container.destroyed) {
      container.play();
    }
  }, []);

  const [options, setOptions] = useState(null);

    useEffect(() => {
    if (trigger) {
        setOptions({
        background: {
            color: { value: 'transparent' },
        },
        fpsLimit: 60,
        interactivity: {
            events: {
            onClick: {
                enable: true,
                mode: 'push',
            },
            onHover: {
                enable: true,
                mode: 'repulse',
            },
            resize: true,
            },
            modes: {
            push: {
                quantity: 4,
            },
            repulse: {
                distance: 100,
                duration: 0.4,
            },
            },
        },
        particles: {
            color: {
            value: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#ffa726', '#26c6da', '#ab47bc'],
            },
            links: {
            color: '#ffffff',
            distance: 150,
            enable: false,
            opacity: 0.5,
            width: 1,
            },
            move: {
            direction: 'top',
            enable: true,
            outModes: {
                default: 'destroy',
            },
            random: true,
            speed: 3,
            straight: false,
            },
            number: {
            density: {
                enable: true,
                area: 1000,
            },
            value: 60,
            },
            opacity: {
            value: 0.9,
            },
            shape: {
            type: ['circle', 'square'],
            },
            size: {
            value: { min: 2, max: 8 },
            },
        },
        detectRetina: true,
        });
        
        // Принудительно запускаем анимацию после небольшой задержки
        setTimeout(() => {
          const container = document.getElementById('tsparticles');
          if (container && container.particles) {
            container.particles.play();
          }
        }, 100);
    } else {
        setOptions(null);
    }
    }, [trigger]);

  if (!options) return null;

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

export default ParticleEffect;