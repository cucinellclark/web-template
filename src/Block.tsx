import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import './Block.css';

interface BlockProps {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Block({ id, children, style }: BlockProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const blockStyle = transform
    ? {
        ...style,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : style;

  return (
    <div ref={setNodeRef} style={blockStyle} {...listeners} {...attributes} className="block">
      {children}
    </div>
  );
} 