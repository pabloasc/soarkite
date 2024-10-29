'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Github, Facebook } from 'lucide-react';

const logos = [Camera, Github, Facebook];

const AnimatedLogos: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white p-8 rounded-full shadow-lg">
      {logos.map((Logo, index) => (
        <div
          key={index}
          className={`transition-all duration-500 ease-in-out absolute ${
            index === currentIndex
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-75'
          }`}
          style={{
            transform: `translateX(-50%) translateY(-50%)`,
          }}
        >
          <Logo size={40} className="text-gray-800" />
        </div>
      ))}
    </div>
  );
};

export default AnimatedLogos;