import React, { useCallback, useEffect, useRef, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const ParticleEffect = ({ trigger }) => {
  const containerRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    if (container && !container.destroyed) {
      containerRef.current = container;
      container.play();
    }
  }, []);

  const [options, setOptions] = useState(null);

  // Фиксируем высоту ОДИН раз при включении эффекта
  useEffect(() => {
    if (trigger && viewportHeight === null) {
      const height = window.innerHeight;
      setViewportHeight(height);
      
      // Записываем в CSS переменную
      document.documentElement.style.setProperty('--particle-vh', `${height}px`);
    }
  }, [trigger, viewportHeight]);

  // Сброс при отключении
  useEffect(() => {
    if (!trigger) {
      setViewportHeight(null);
    }
  }, [trigger]);

  useEffect(() => {
    if (trigger) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      setOptions({
        background: {
          color: { value: 'transparent' },
        },
        fpsLimit: isMobile ? 30 : 60,
        smooth: true,
        
        interactivity: {
          events: {
            // onClick: {
            //   enable: true,
            //   mode: 'push',
            // },
            // onHover: {
            //   enable: true,
            //   mode: 'repulse',
            // },
            // resize: false,
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
            enable: false,
          },
          move: {
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: true,
            speed: isMobile ? 1.2 : 1.2,
            straight: false,
            direction: 'none',
            attract: {
              enable: false,
            },
            decay: 0,
          },
          number: {
            density: {
              enable: true,
              area: isMobile ? 1500 : 1000,
            },
            value: isMobile ? 30 : 40,
          },
          opacity: {
            value: 0.9,
          },
          shape: {
            type: ['circle', 'square', 'triangle', 'polygon'],
          },
          size: {
            value: { min: 2, max: isMobile ? 5 : 7 },
          },
        },
        detectRetina: true,
        fullScreen: {
          enable: false,
          zIndex: -1,
        },
        // КРИТИЧНО: делаем canvas интерактивным, но прозрачным для кликов
        interactivity: {
          detectsOn: 'window', // Слушаем события на всём окне
          events: {
            // onClick: {
            //   enable: true,
            //   mode: 'push',
            // },
            // onHover: {
            //   enable: true,
            //   mode: 'repulse',
            // },
            // resize: false,
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
      });
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
      style={{
        height: viewportHeight ? `${viewportHeight}px` : '100vh',
        minHeight: viewportHeight ? `${viewportHeight}px` : '100vh',
        maxHeight: viewportHeight ? `${viewportHeight}px` : '100vh',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    />
  );
};

export default ParticleEffect;