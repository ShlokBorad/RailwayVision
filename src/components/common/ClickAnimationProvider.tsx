import React, { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
  color: string;
}

// Single signature glowing cyan color for click sparkles
const SIGNATURE_SPARK_COLOR = '#00E5FF';

interface ClickAnimationProviderProps {
  children: React.ReactNode;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
}

export const ClickAnimationProvider: React.FC<ClickAnimationProviderProps> = ({
  children,
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);

  // Ease-out calculation
  const easeOut = (t: number): number => {
    return t * (2 - t);
  };

  // Canvas animation loop
  const animateSparks = (timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparksRef.current = sparksRef.current.filter((spark) => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= duration) return false;

      const progress = easeOut(elapsed / duration);
      const currentRadius = progress * sparkRadius * 1.2;
      const currentSize = sparkSize * (1 - progress);

      const x1 = spark.x + currentRadius * Math.cos(spark.angle);
      const y1 = spark.y + currentRadius * Math.sin(spark.angle);
      const x2 = spark.x + (currentRadius + currentSize) * Math.cos(spark.angle);
      const y2 = spark.y + (currentRadius + currentSize) * Math.sin(spark.angle);

      ctx.strokeStyle = spark.color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      return true;
    });

    if (sparksRef.current.length > 0) {
      animFrameRef.current = requestAnimationFrame(animateSparks);
    } else {
      isAnimatingRef.current = false;
    }
  };

  const startAnimation = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    animFrameRef.current = requestAnimationFrame(animateSparks);
  };

  // Resize canvas to full window size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Handle click events
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const now = performance.now();
      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        x: e.clientX,
        y: e.clientY,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
        color: SIGNATURE_SPARK_COLOR,
      }));

      sparksRef.current.push(...newSparks);
      startAnimation();
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [sparkCount]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99999,
        }}
      />
      {children}
    </>
  );
};
