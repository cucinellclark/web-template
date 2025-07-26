import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import './BlockBuilder.css';

function BlockBuilder() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const groundRef = useRef<Matter.Body | null>(null);

  const spawnNewBlock = () => {
    if (!isInitialized || !engineRef.current) return;
    
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
    if (!isInitialized || !engineRef.current || !renderRef.current) return;
    
    const engine = engineRef.current;
    const render = renderRef.current;
    
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
    if (render.canvas) {
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

    // Create fresh engine instance
    const engine = Matter.Engine.create();
    engineRef.current = engine;

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
    renderRef.current = render;

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
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    setIsInitialized(true);

    return () => {
      // Proper cleanup sequence
      setIsInitialized(false);
      
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
        runnerRef.current = null;
      }
      
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
        renderRef.current.textures = {};
        renderRef.current = null;
      }
      
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
      
      groundRef.current = null;
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