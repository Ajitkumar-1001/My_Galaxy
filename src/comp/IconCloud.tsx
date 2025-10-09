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
  rotationSpeed?: number;
}

const IconCloud: React.FC<IconCloudProps> = ({ 
  icons, 
  className = "", 
  size = 300,
  rotationSpeed = 0.0015
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Array<{ x: number; y: number; z: number; originalX: number; originalY: number; originalZ: number }>>([]);
  const [, forceUpdate] = useState({});
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Generate evenly distributed sphere positions like continents on a globe
  useEffect(() => {
    const radius = size * 0.45; // Optimal radius for no collisions
    const newPositions = icons.map((_, index) => {
      // Create evenly distributed points using spherical coordinates
      const numIcons = icons.length;
      
      // Use spiral distribution for even spacing
      const y = 1 - (index / (numIcons - 1)) * 2; // Y from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = Math.sqrt(numIcons * Math.PI) * Math.asin(y);
      
      const x = Math.cos(theta) * radiusAtY * radius;
      const z = Math.sin(theta) * radiusAtY * radius;
      const yPos = y * radius;

      return {
        x,
        y: yPos,
        z,
        originalX: x,
        originalY: yPos,
        originalZ: z,
      };
    });
    setPositions(newPositions);
  }, [icons, size]);


  // Perfect spherical rotation animation loop
  useEffect(() => {
    let isVisible = true;
    let startTime = performance.now();

    // Use Intersection Observer to pause animation when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameRef.current) {
          startTime = performance.now();
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

      // Calculate rotation based on time elapsed for consistent speed
      const elapsed = currentTime - startTime;
      rotationRef.current = elapsed * rotationSpeed;

      // Force re-render to update transforms
      forceUpdate({});

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    startTime = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [rotationSpeed]);

  const getTransform = (position: { x: number; y: number; z: number; originalX: number; originalY: number; originalZ: number }) => {
    // Globe rotation ONLY around X and Z axes (NO Y-axis rotation)
    const rotation = rotationRef.current;
    
    // Start with original position
    let rotatedX = position.originalX;
    let rotatedY = position.originalY;
    let rotatedZ = position.originalZ;
    
    // Rotation around X axis (up/down tilt)
    const rotationX = rotation;
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const tempY = rotatedY;
    const tempZ = rotatedZ;
    rotatedY = tempY * cosX - tempZ * sinX;
    rotatedZ = tempY * sinX + tempZ * cosX;
    
    // Rotation around Z axis (roll/twist)
    const rotationZ = rotation * 0.6; // Different speed for Z axis
    const cosZ = Math.cos(rotationZ);
    const sinZ = Math.sin(rotationZ);
    const tempX = rotatedX;
    const tempY2 = rotatedY;
    rotatedX = tempX * cosZ - tempY2 * sinZ;
    rotatedY = tempX * sinZ + tempY2 * cosZ;

    // Calculate depth based on Z position (front to back)
    const maxRadius = size * 0.45;
    const normalizedZ = (rotatedZ + maxRadius) / (2 * maxRadius);
    const depth = Math.max(0, Math.min(1, normalizedZ));
    
    // Visibility based on position relative to viewer
    const opacity = Math.max(0.2, Math.min(1, depth * 1.1));
    const scale = 0.7 + depth * 0.3; // Less dramatic scaling
    const blur = (1 - depth) * 6; // Moderate blur for depth
    
    // Convert 3D position to 2D screen coordinates
    const screenX = rotatedX + size / 2;
    const screenY = rotatedY + size / 2;
    
    return {
      x: screenX,
      y: screenY,
      scale,
      opacity,
      blur,
      zIndex: Math.floor(depth * 1000),
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Render icons in depth order (back to front) */}
      {icons
        .map((iconData, index) => ({ iconData, index, transform: positions[index] ? getTransform(positions[index]) : null }))
        .filter(item => item.transform !== null)
        .sort((a, b) => (a.transform?.zIndex || 0) - (b.transform?.zIndex || 0))
        .map(({ iconData, index, transform }) => {
          if (!transform) return null;
          
          const Icon = iconData.icon;
          const baseIconSize = 72; // Slightly smaller to prevent collisions
          const iconSize = baseIconSize * transform.scale; // Size varies with depth
          
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
                filter: `blur(${transform.blur}px)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: transform.opacity, scale: transform.scale }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                delay: index * 0.05 // Stagger animation
              }}
            >
              <Icon 
                className="text-blue-400 drop-shadow-lg" 
                size={iconSize}
              />
              <span 
                className="text-sm text-blue-300/90 mt-2 font-semibold whitespace-nowrap drop-shadow-lg"
                style={{ 
                  fontSize: `${12 + transform.scale * 4}px`, // Text size scales with depth
                  textShadow: '0 0 12px rgba(59, 130, 246, 0.7)'
                }}
              >
                {iconData.name}
              </span>
            </motion.div>
          );
        })}
      
      {/* Enhanced center glow effect */}
      {/* <div className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/20 bg-gradient-radial from-blue-500/5 to-transparent pointer-events-none flex flex-col items-center justify-center backdrop-blur-sm">
        <div className="absolute inset-0 rounded-full border border-blue-400/10 animate-pulse"></div>
        <h1 className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text drop-shadow-lg text-center leading-tight">
          Building with
        </h1>
      </div> */}
    </div>
  );
};

export default IconCloud;