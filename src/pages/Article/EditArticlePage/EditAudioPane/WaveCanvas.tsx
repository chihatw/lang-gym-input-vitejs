import React, { useEffect, useRef } from 'react';
import { ArticleVoiceState } from '../Model';

const WAVE_COLOR = 'pink';
const HEIGHT = 100;

const WaveCanvas = ({ state }: { state: ArticleVoiceState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const { peaks, sentenceLines } = state;
    const height = HEIGHT;
    const color = WAVE_COLOR;

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.height = height;
    canvas.width = peaks.length;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    peaks.forEach((peak, xPos) => {
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
    });
  }, [state]);
  return (
    <div style={{ border: '1px solid #eee' }}>
      <canvas ref={canvasRef} style={{ verticalAlign: 'bottom' }} />
    </div>
  );
};

export default WaveCanvas;
