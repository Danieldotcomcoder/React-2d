import { useEffect, useRef, useState } from 'react';
import { Engine, Render, Runner, Bodies, World, Events } from 'matter-js';

function Comp() {
  const sceneRef = useRef(null);
  const engineRef = useRef(Engine.create());
  const runnerRef = useRef(Runner.create());
  const [message, setMessage] = useState('');

  const addcircle1 = (en) => {
    const smallCircle = Bodies.circle(200, 50,20, {
      speed: 1,
      restitution: 1.5,

      render: {
        fillStyle: 'blue',
      },
    });

    World.add(en.world, [smallCircle]);
  };

  const addcircle2 = (en) => {
    const smallCircle = Bodies.circle(450, 50, 20, {
      restitution: 1.4,
      render: {
        fillStyle: 'blue',
      },
    });

    World.add(en.world, [smallCircle]);
  };

  const addcircle3 = (en) => {
    const smallCircle = Bodies.circle(650, 50, 20, {
      restitution: 1.4,
      render: {
        fillStyle: 'blue',
      },
    });

    World.add(en.world, [smallCircle]);
  };

  var circleCount = 0;
  let circlesCreated = 0;
  let lastCreated = Date.now();

  const checkballcollision = (balls, en) => {
    const now = Date.now();
    if (now - lastCreated >= 30) {
      circleCount = 0;
      lastCreated = now;
      if (circlesCreated < 250) {
        if (
          balls.collision.bodyA.label === 'Circle Body' &&
          balls.collision.bodyB.label === 'Circle Body'
        ) {
          const randomNumberX = Math.floor(Math.random() * (950 - 50 + 1)) + 50;

          const smallCircle = Bodies.circle(randomNumberX, 1, 20, {
            restitution: 1,
           
          });

          World.add(en.world, [smallCircle]);
          circlesCreated++;
          circleCount++;
        }
      } else {
        return 55;
      }
    }
  };

  useEffect(() => {
    const { current: scene } = sceneRef;
    const { current: engine } = engineRef;
    const { current: runner } = runnerRef;

    engine.gravity.y = 0.5;
    engine.gravity.x = 0;
    

    const render = Render.create({
      element: scene,
      engine: engine,

      options: {
        width: 1200,
        height: 400,
        wireframes: false,
        background: 'lightgrey',
      },
    });

    var ground = Bodies.rectangle(0, 400, 2400, 10, { isStatic: true });
    var ceiling = Bodies.rectangle(400, 0, 1600, 10, { isStatic: true });
    var leftWall = Bodies.rectangle(0, 300, 10, 620, { isStatic: true });
    var rightWall = Bodies.rectangle(1200, 200, 10, 400, { isStatic: true });

    World.add(engine.world, [ground, ceiling, leftWall, rightWall]);
    render.canvas.addEventListener('mousedown', function (e) {
      console.log(
        engine.world.bodies[engine.world.bodies.length - 1].render.visible
      );
      const mousePosition = { x: e.clientX, y: e.clientY };
      const smallCircle = Bodies.circle(mousePosition.x, mousePosition.y, 20, {
        restitution: 1.2,
        render: {
          fillStyle: 'red',
        },
      });

      World.add(engine.world, [smallCircle]);
    });

    addcircle1(engine);
    addcircle2(engine);
    addcircle3(engine);

    Events.on(engine, 'collisionStart', function (event) {
      var pairs = event.pairs;

      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if (checkballcollision(pair, engine) === 55) {
          setMessage('Limit Reached, Restarting ..... ');
          setTimeout(() => {
            setMessage('');
            location.reload();
          }, 3000);
        }
      }
    });

    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);

      if (render.canvas) {
        render.canvas.remove();
      }
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  return (
    <div>
      <div> {message}</div>
      <div ref={sceneRef} />

      <p>Click inside to create more circles</p>
    </div>
  );
}

export default Comp;
