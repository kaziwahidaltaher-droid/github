/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef } from 'react';
import { ConwayGameOfLife } from './Conway.GameOfLife';
import { LensConfig } from './ArtisticLensPanel';
import { Analyser } from './analyser';

// Define the props for the visualizer component
export interface GameOfLifeVisualizerProps {
  analyser?: Analyser; // Included for API consistency, not used yet
  lensConfig: LensConfig;
}

/**
 * A React component that renders Conway's Game of Life on a canvas.
 */
export const GameOfLifeVisualizer: React.FC<GameOfLifeVisualizerProps> = ({ lensConfig }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<ConwayGameOfLife | null>(null);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 8;
    let lastRenderTime = 0;
    const renderInterval = 100; // 10 frames per second

    const resizeCanvas = () => {
      const { devicePixelRatio: ratio = 1 } = window;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.scale(ratio, ratio);

      const cols = Math.floor(width / cellSize);
      const rows = Math.floor(height / cellSize);
      
      if (!gameRef.current || gameRef.current.cols !== cols || gameRef.current.rows !== rows) {
          gameRef.current = new ConwayGameOfLife(rows, cols);
          gameRef.current.randomize();
      }
    };

    const render = (timestamp: number) => {
      animationFrameId.current = requestAnimationFrame(render);
      if (timestamp - lastRenderTime < renderInterval) {
        return;
      }
      lastRenderTime = timestamp;

      if (!gameRef.current) return;
      gameRef.current.nextGeneration();
      
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const cellColor = lensConfig.colorGrading === 'Cyberpunk' ? '#00e5ff' : '#ffffff';
      ctx.fillStyle = cellColor;

      const grid = gameRef.current.getGrid();
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (grid[row][col] === 1) {
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    resizeCanvas();
    render(0);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [lensConfig]);

  return (
    <div className="visualizer-scene">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      <div className="visualizer-overlay">
        <h2 className="visualizer-title">CELLULAR AUTOMATA</h2>
        <p className="visualizer-subtitle">SIMULATING CONWAY'S GAME OF LIFE</p>
      </div>
    </div>
  );
};