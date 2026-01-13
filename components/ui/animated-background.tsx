"use client";

import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Check if dark mode
    const isDark = document.documentElement.classList.contains('dark');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      speedX: number = 0;
      speedY: number = 0;
      hue: number = 0;
      
      constructor() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 80 + 40;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        // Playful Warm palette
        const isDark = document.documentElement.classList.contains('dark');
        // Light: Orange, Yellow, Pink, Coral | Dark: Deep Purple, Mauve, Indigo
        const hues = isDark ? [260, 280, 320, 340] : [35, 45, 10, 340]; 
        this.hue = hues[Math.floor(Math.random() * hues.length)];
      }

      update() {
        if (!canvas) return;
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        const isDark = document.documentElement.classList.contains('dark');
        const opacity = isDark ? 0.15 : 0.06; // Reduced opacity for light mode
        
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        
        // Warmer, softer colors for light mode
        gradient.addColorStop(0, `hsla(${this.hue}, ${isDark ? '70%' : '40%'}, ${isDark ? '60%' : '55%'}, ${opacity})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, ${isDark ? '70%' : '40%'}, ${isDark ? '50%' : '50%'}, ${opacity * 0.6})`);
        gradient.addColorStop(1, `hsla(${this.hue}, ${isDark ? '70%' : '40%'}, ${isDark ? '50%' : '50%'}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles - fewer for better performance
    const particlesArray: Particle[] = [];
    const numberOfParticles = 4;

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: 'transparent',
      }}
    />
  );
}
