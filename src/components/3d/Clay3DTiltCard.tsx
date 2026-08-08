import React, { useRef, useState } from 'react';

interface Clay3DTiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  maxTilt?: number; // degrees
}

export const Clay3DTiltCard: React.FC<Clay3DTiltCardProps> = ({
  children,
  className = '',
  onClick,
  maxTilt = 8,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shadowX: 0, shadowY: 12 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTilt({
      x: rotateX,
      y: rotateY,
      shadowX: rotateY * -1.5,
      shadowY: 12 + Math.abs(rotateX) * 1.2,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, shadowX: 0, shadowY: 12 });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-in-out',
      }}
      className={`cursor-pointer transform-gpu ${className}`}
    >
      {children}
    </div>
  );
};
