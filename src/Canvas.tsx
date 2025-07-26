import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import './Canvas.css';

interface CanvasProps {
  children: React.ReactNode;
}

export function Canvas({ children }: CanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  return (
    <div ref={setNodeRef} className="canvas">
      {children}
    </div>
  );
} 