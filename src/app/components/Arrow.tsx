import React from 'react';

interface ArrowProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export const Arrow: React.FC<ArrowProps> = ({ start, end }) => {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="black" strokeWidth={2} />
      <polygon 
        points="-10,-5 0,0 -10,5" 
        fill="black"
        transform={`translate(${end.x},${end.y}) rotate(${angle * 180 / Math.PI})`}
      />
    </svg>
  );
};