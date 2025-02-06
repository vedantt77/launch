import React, { useState, useEffect } from 'react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const istOffset = 0 * 60 * 60 * 1000; // IST is UTC+5:30
      const istNow = new Date(now.getTime() + istOffset);
      const tomorrow = new Date(istNow);
      tomorrow.setHours(24, 0, 0, 0);
      
      let difference = tomorrow.getTime() - istNow.getTime();
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      difference -= hours * (1000 * 60 * 60);
      
      const minutes = Math.floor(difference / (1000 * 60));
      difference -= minutes * (1000 * 60);
      
      const seconds = Math.floor(difference / 1000);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="font-mono text-2xl text-indigo-600">{timeLeft}</span>
  );
}