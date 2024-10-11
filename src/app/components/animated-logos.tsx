'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Github, Facebook } from 'lucide-react';

const logos = [Camera, Github, Facebook];

const AnimatedLogos: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, 3000); // Change logo every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center h-20 overflow-hidden">
      {logos.map((Logo, index) => (
        <div
          key={index}
          className={`transition-all duration-500 ease-in-out absolute ${
            index === currentIndex
              ? 'opacity-100 scale-100'
              : 'opacity-50 scale-75'
          }`}
          style={{
            transform: `translateX(${(index - currentIndex) * 100}%)`,
          }}
        >
          <Logo size={48} />
        </div>
      ))}
    </div>
  );
};

export default AnimatedLogos;