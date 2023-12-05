import React, { useEffect, useRef, useState } from 'react';

const MandelbrotSet: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [centerX, setCenterX] = useState<number | null>(null);
  const [centerY, setCenterY] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const handleZoom = (event: WheelEvent) => {
      const scaleFactor = 1.2;

      if (event.deltaY < 0) {
        // Zoom in
        setZoom((prevZoom) => prevZoom * scaleFactor);
      } else {
        // Zoom out
        setZoom((prevZoom) => prevZoom / scaleFactor);
      }

      // Set the center coordinates based on the mouse position
      if (canvas && ctx) {
        const boundingRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - boundingRect.left;
        const mouseY = event.clientY - boundingRect.top;

        const minVal = -2 / zoom;
        const maxVal = 2 / zoom;

        const rangeX = (maxVal - minVal) * (mouseX / canvas.width);
        const rangeY = (maxVal - minVal) * (mouseY / canvas.height);

        setCenterX(minVal + rangeX);
        setCenterY(minVal + rangeY);
      }
    };

    canvas?.addEventListener('wheel', handleZoom);

    return () => {
      canvas?.removeEventListener('wheel', handleZoom);
    };
  }, [zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const maxIterations = 100;
    const minVal = -2 / zoom;
    const maxVal = 2 / zoom;
    const range = maxVal - minVal;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let zx = x * (range / width) + minVal;
        let zy = y * (range / height) + minVal;

        zx += centerX || 0;
        zy += centerY || 0;

        let cx = zx;
        let cy = zy;

        let iter = 0;
        while (iter < maxIterations) {
          const x2 = zx * zx;
          const y2 = zy * zy;

          if (x2 + y2 > 4) {
            break;
          }

          const twoxy = 2 * zx * zy;
          zx = x2 - y2 + cx;
          zy = twoxy + cy;

          iter++;
        }

        const brightness = (iter / maxIterations) * 255;
        const color = `rgb(${brightness},${brightness},${brightness})`;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [zoom, centerX, centerY]);

  return <canvas ref={canvasRef} />;
};

export default MandelbrotSet;
