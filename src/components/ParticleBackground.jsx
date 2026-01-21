// frontend/src/components/ParticleBackground.jsx
import { useEffect, useRef } from 'react';

const ParticleBackground = ({ theme = 'default' }) => {
  const bgCanvasRef = useRef(null);
  const cursorCanvasRef = useRef(null);

  useEffect(() => {
    const canvasBg = bgCanvasRef.current;
    const canvasCursor = cursorCanvasRef.current;
    const ctxBg = canvasBg.getContext('2d');
    const ctxCursor = canvasCursor.getContext('2d');

    let width, height;
    let particlesArray = [];
    let mouseTrail = [];

    // --- THEME CONFIGURATION ---
    const themes = {
      default: {
        particleColor: 'rgba(139, 157, 166, 0.5)',
        lineColor: '0, 224, 167', // Cyan RGB
        mouseColor: '#00e0a7'     // Cyan Hex
      },
      red: {
        particleColor: 'rgba(166, 139, 139, 0.5)',
        lineColor: '255, 46, 99', // Red RGB
        mouseColor: '#ff2e63'     // Red Hex
      }
    };

    const currentConfig = themes[theme] || themes.default;

    // Physics Config
    const config = {
      gridSpacing: 50,
      connectionDistance: 3500,
      mouseRadius: 120
    };

    let mouse = { x: undefined, y: undefined };
    let smoothMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const hexToRgba = (hex, alpha) => {
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvasBg.width = width;
      canvasBg.height = height;
      canvasCursor.width = width;
      canvasCursor.height = height;
    };

    class Particle {
      constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.baseX = x; 
        this.baseY = y;
        this.size = size;
        this.density = (Math.random() * 30) + 1;
      }

      draw() {
        ctxBg.beginPath();
        ctxBg.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctxBg.fillStyle = currentConfig.particleColor; // Dynamic Color
        ctxBg.fill();
      }

      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = config.mouseRadius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < config.mouseRadius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
        this.draw();
      }
    }

    const init = () => {
      particlesArray = [];
      for (let y = 0; y < height + config.gridSpacing; y += config.gridSpacing) {
        for (let x = 0; x < width + config.gridSpacing; x += config.gridSpacing) {
          particlesArray.push(new Particle(x, y, 2));
        }
      }
    };

    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = dx * dx + dy * dy;

          if (distance < config.connectionDistance) {
            opacityValue = 1 - (distance / config.connectionDistance);
            // Dynamic Line Color
            ctxBg.strokeStyle = `rgba(${currentConfig.lineColor}, ${opacityValue * 0.3})`;
            ctxBg.lineWidth = 1;
            ctxBg.beginPath();
            ctxBg.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctxBg.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctxBg.stroke();
          }
        }
      }
    };

    let animationFrameId;
    const animate = () => {
      ctxBg.clearRect(0, 0, width, height);
      ctxCursor.clearRect(0, 0, width, height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();

      if (mouse.x !== undefined && mouse.y !== undefined) {
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.15;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.15;

        mouseTrail.push({ x: smoothMouse.x, y: smoothMouse.y });
        if (mouseTrail.length > 20) mouseTrail.shift();

        for (let i = 0; i < mouseTrail.length; i++) {
          let opacity = i / mouseTrail.length;
          ctxCursor.beginPath();
          ctxCursor.arc(mouseTrail[i].x, mouseTrail[i].y, 2 + (i * 0.1), 0, Math.PI * 2);
          ctxCursor.fillStyle = hexToRgba(currentConfig.mouseColor, opacity * 0.4);
          ctxCursor.fill();
        }

        ctxCursor.shadowBlur = 10;
        ctxCursor.shadowColor = currentConfig.mouseColor;
        ctxCursor.fillStyle = currentConfig.mouseColor;
        ctxCursor.beginPath();
        ctxCursor.arc(smoothMouse.x, smoothMouse.y, 4, 0, Math.PI * 2);
        ctxCursor.fill();
        ctxCursor.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => { resize(); init(); };
    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseOut = () => { mouse.x = undefined; mouse.y = undefined; mouseTrail = []; };

    resize();
    init();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // RE-RUN WHEN THEME CHANGES

  return (
    <>
      <canvas ref={bgCanvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
      <canvas ref={cursorCanvasRef} className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none" />
    </>
  );
};

export default ParticleBackground;