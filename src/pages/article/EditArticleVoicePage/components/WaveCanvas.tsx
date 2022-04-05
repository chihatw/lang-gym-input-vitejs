import React, { useEffect, useRef } from 'react';

// useEffect ではなく、requestAnimationFrame を使うのでは?

const WaveCanvas = ({
  peaks,
  color,
  height,
  sentenceLines,
  currentTimePos,
}: {
  peaks: number[];
  color: string;
  height: number;
  sentenceLines: { xPos: number; color: string }[];
  currentTimePos: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.height = height;
    canvas.width = peaks.length;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    peaks.forEach((peak, xPos) => {
      if (xPos === Math.round(currentTimePos)) {
        context.fillStyle = 'green';
        context!.fillRect(xPos, 0, 1, height);
      } else {
        const sentenceLine = sentenceLines.filter(
          ({ xPos: _xPos }) => xPos === _xPos
        )[0];

        if (!!sentenceLine) {
          context.fillStyle = sentenceLine.color;
          context.fillRect(xPos, 0, 1, height);
        } else {
          context!.fillStyle = color;
          const posY = (height / 2) * (1 - peak);
          const barHeight = height! * peak;
          context.fillRect(xPos, posY, 1, barHeight);
        }
      }
    });
  }, [peaks, height, sentenceLines, currentTimePos]);
  return (
    <div style={{ border: '1px solid #eee' }}>
      <canvas ref={canvasRef} style={{ verticalAlign: 'bottom' }} />
    </div>
  );
};

export default WaveCanvas;
