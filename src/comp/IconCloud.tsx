import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';

interface IconCloudProps {
  icons: readonly{
    icon: IconType;
    name: string;
}[];
  className?: string;
  size?: number;
}

const IconCloud: React.FC<IconCloudProps> = ({ icons, className = "", size = 300}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Array<{ x: number; y: number; z: number; scale: number }>>([]);
  const [, forceUpdate] = useState({});
  const rotationRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  // Generate sphere positions for icons
  useEffect(() => {
    const radius = size / 2 - 0.5;
    const newPositions = icons.map((_, index) => {
      const phi = Math.acos(-1 + (2 * index) / icons.length);
      const theta = Math.sqrt(icons.length * Math.PI) * phi;
      
      return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        scale: 1 + Math.random() * 0.4, // Random scale between 0.8 and 1.2
      };
    });
    setPositions(newPositions);
  }, [icons, size]);

  // Handle mouse and touch movement for interactive rotation
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseRef.current.x = (clientX - centerX) / rect.width;
      mouseRef.current.y = (clientY - centerY) / rect.height;
    };

    const handleMouseMove = (event: MouseEvent) => {
      handleMove(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        handleMove(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    let lastTime = 0;
    let isVisible = true;

    // Use Intersection Observer to pause animation when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameRef.current) {
          lastTime = performance.now();
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const animate = (currentTime: number) => {
      if (!isVisible) {
        animationFrameRef.current = null;
        return;
      }

      const deltaTime = lastTime === 0 ? 0 : (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Enhanced auto rotation - more noticeable revolving motion
      rotationRef.current.x += deltaTime * 0.5;
      rotationRef.current.y += deltaTime * 0.8;

      // Mouse influence (reduced for better performance)
      rotationRef.current.x += mouseRef.current.y * deltaTime * 0.3;
      rotationRef.current.y += mouseRef.current.x * deltaTime * 0.3;

      // Force re-render to update transforms
      forceUpdate({});

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastTime = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  const getTransform = (position: { x: number; y: number; z: number; scale: number }, index: number) => {
    const time = Date.now() * 0.001;
    
    // Apply rotation
    const cosX = Math.cos(rotationRef.current.x);
    const sinX = Math.sin(rotationRef.current.x);
    const cosY = Math.cos(rotationRef.current.y);
    const sinY = Math.sin(rotationRef.current.y);
    
    // Rotate around Y axis
    let x = position.x * cosY - position.z * sinY;
    let z = position.x * sinY + position.z * cosY;
    
    // Rotate around X axis
    let y = position.y * cosX - z * sinX;
    z = position.y * sinX + z * cosX;

    // Add slight floating animation
    y += Math.sin(time + index) * 5;
    x += Math.cos(time * 0.7 + index) * 3;

    // Calculate depth-based scale and opacity
    const depth = (z + size / 2) / size;
    const scale = position.scale * (0.6 + depth * 0.4);
    const opacity = 0.3 + depth * 0.7;

    return {
      x: x + size / 2,
      y: y + size / 2,
      scale,
      opacity,
      zIndex: Math.floor(depth * 100),
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto cursor-pointer ${className}`}
      style={{ width: size, height: size }}
    >
      {icons.map((iconData, index) => {
        if (!positions[index]) return null;
        
        const transform = getTransform(positions[index], index);
        const Icon = iconData.icon;
        
        return (
          <motion.div
            key={`${iconData.name}-${index}`}
            className="absolute flex flex-col items-center pointer-events-none select-none"
            style={{
              left: transform.x,
              top: transform.y,
              transform: `translate(-50%, -50%) scale(${transform.scale})`,
              opacity: transform.opacity,
              zIndex: transform.zIndex,
            }}
            whileHover={{ scale: transform.scale * 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Icon 
              className="text-blue-400 drop-shadow-lg" 
              size={48 + Math.floor(transform.scale * 8)}
            />
            <span 
              className="text-xs text-blue-300 mt-1 font-medium whitespace-nowrap"
              style={{ fontSize: `${12 + transform.scale * 4}px` }}
            >
              {iconData.name}
            </span>
          </motion.div>
        );
      })}
      
      {/* Center glow effect */}
      {/* <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl pointer-events-none" /> */}
    </div>
  );
};

export default IconCloud;