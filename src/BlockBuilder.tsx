import React, { useState } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Block } from './Block';
import { Canvas } from './Canvas';
import './BlockBuilder.css';

interface BlockData {
  id: string;
  top: number;
  left: number;
  content: string;
}

function BlockBuilder() {
  const [blocks, setBlocks] = useState<BlockData[]>([
    { id: 'block-1', top: 20, left: 20, content: 'Block 1' },
    { id: 'block-2', top: 100, left: 150, content: 'Block 2' },
  ]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id === active.id) {
          return { ...block, top: block.top + delta.y, left: block.left + delta.x };
        }
        return block;
      })
    );
  }

  return (
    <div className="block-builder">
      <DndContext onDragEnd={handleDragEnd}>
        <h3>Block Builder</h3>
        <Canvas>
          {blocks.map((block) => (
            <Block key={block.id} id={block.id} style={{ top: block.top, left: block.left }}>
              {block.content}
            </Block>
          ))}
        </Canvas>
      </DndContext>
    </div>
  );
}

export default BlockBuilder; 