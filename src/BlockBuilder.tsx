import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import './BlockBuilder.css';

function BlockBuilder() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Matter.Engine.create());
  const [isInitialized, setIsInitialized] = useState(false);
  const groundRef = useRef<Matter.Body | null>(null);

  const spawnNewBlock = () => {
    if (!isInitialized) return;
    
    const engine = engineRef.current;
    // Create a new block at a random position at the top
    const x = 200 + Math.random() * 400; // Random x between 200-600
    const y = 50; // Start at the top
    const size = 60 + Math.random() * 40; // Random size between 60-100
    
    const newBlock = Matter.Bodies.rectangle(x, y, size, size, {
      render: {
        fillStyle: `hsl(${Math.random() * 360}, 70%, 60%)` // Random color
      }
    });
    
    Matter.Composite.add(engine.world, newBlock);
  };

  const resetSimulation = () => {
    if (!isInitialized) return;
    
    const engine = engineRef.current;
    
    // Clear all bodies from the world
    Matter.Composite.clear(engine.world, false);
    
    // Re-add the ground
    const ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    groundRef.current = ground;
    
    // Re-add the original two blocks
    const boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
    const boxB = Matter.Bodies.rectangle(450, 50, 80, 80);
    
    Matter.Composite.add(engine.world, [ground, boxA, boxB]);
    
    // Re-add mouse constraint
    const render = engine.render;
    if (render && render.canvas) {
      const mouse = Matter.Mouse.create(render.canvas);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });
      
      Matter.Composite.add(engine.world, mouseConstraint);
      render.mouse = mouse;
    }
  };

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) {
      return;
    }

    const engine = engineRef.current;
    const render = Matter.Render.create({
      element: scene,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#f8f9fa',
      },
    });

    // Store render reference in engine for reset function
    engine.render = render;

    const ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    groundRef.current = ground;
    const boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
    const boxB = Matter.Bodies.rectangle(450, 50, 80, 80);

    Matter.Composite.add(engine.world, [ground, boxA, boxB]);

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Matter.Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    setIsInitialized(true);

    return () => {
      Matter.Runner.stop(runner);
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
      setIsInitialized(false);
    };
  }, []);

  return (
    <div className="block-builder">
      <h3>Block Builder with Gravity</h3>
      <div className="button-container">
        <button 
          className="spawn-button" 
          onClick={spawnNewBlock}
          disabled={!isInitialized}
        >
          Spawn New Block
        </button>
        <button 
          className="reset-button" 
          onClick={resetSimulation}
          disabled={!isInitialized}
        >
          Reset
        </button>
      </div>
      <div ref={sceneRef} className="scene-container" />
    </div>
  );
}

export default BlockBuilder; 