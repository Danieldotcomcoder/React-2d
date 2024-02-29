import { useEffect, useRef, useState } from 'react';
import { Engine, Render, Runner, Bodies, World, Body } from 'matter-js';
import KNN from 'ml-knn';

const Knearestneighbor = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(Engine.create());
  const runnerRef = useRef(Runner.create());
  const [balls, setBalls] = useState([]);
  const [knn, setKNN] = useState(null);
  const [check, setCheck] = useState(false);
  const [colorName, setColorName] = useState('Color');

  const generateBalls = () => {
    let positions = [];
    for (let i = 0; i < 15; i++) {
      let firstNumber = Math.floor(Math.random() * (1150 - 1000 + 1)) + 1000;
      let secondNumber = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
      positions.push([firstNumber, secondNumber, [255, 0, 0]]);
      let firstNumber2 = Math.floor(Math.random() * (750 - 600 + 1)) + 600;
      let secondNumber2 = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
      positions.push([firstNumber2, secondNumber2, [0, 255, 0]]);
      let firstNumber3 = Math.floor(Math.random() * (450 - 300 + 1)) + 300;
      let secondNumber3 = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
      positions.push([firstNumber3, secondNumber3, [0, 0, 255]]);
      let firstNumber4 = Math.floor(Math.random() * (0 - 200 + 1)) + 200;
      let secondNumber4 = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
      positions.push([firstNumber4, secondNumber4, [0, 0, 0]]);
      let firstNumber5 = Math.floor(Math.random() * (150 - 250 + 1)) + 250;
      let secondNumber5 = Math.floor(Math.random() * (350 - 250 + 1)) + 250;
      positions.push([firstNumber5, secondNumber5, [255, 255, 255]]);
    }
    setCheck(true);
    setBalls(positions);
  };

  const  rgbToHex = (rgb) => {
    return (
      '#' +
      rgb
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  const rgbToColorName = (rgb) => {
    const [r, g, b] = rgb;
    
    const colors = {
      '255, 0, 0': 'red',
      '0, 255, 0': 'green',
      '0, 0, 255': 'blue',
      '0, 0, 0': 'black',
      '255, 255, 255': 'white',
    };
    
    
    const rgbString = `${r}, ${g}, ${b}`;
    
    
    if (Object.prototype.hasOwnProperty.call(colors, rgbString)) {
      return colors[rgbString];
    } else {
      return 'unknown';
    }
  }
  

  const trainKNNModel = () => {
    if (balls.length > 0) {
      let dataset = balls.map((ball) => ball[2]);
      let labels = balls.map((ball) => [ball[0], ball[1]]);
      let k = new KNN(dataset, labels, { k: 5 });
      setKNN(k);
    }
  };

  useEffect(() => {
    generateBalls();
    trainKNNModel();
  }, [check]);

  useEffect(() => {
    const { current: scene } = sceneRef;
    const { current: engine } = engineRef;
    const { current: runner } = runnerRef;

    engine.gravity.y = 0;
    engine.gravity.x = 0;

    const render = Render.create({
      element: scene,
      engine: engine,

      options: {
        width: 1200,
        height: 600,
        wireframes: false,
        background: 'lightgrey',
      },
    });

    var ground = Bodies.rectangle(0, 600, 2400, 10, { isStatic: true });
    var ceiling = Bodies.rectangle(400, 0, 1600, 10, { isStatic: true });
    var leftWall = Bodies.rectangle(0, 300, 10, 600, { isStatic: true });
    var rightWall = Bodies.rectangle(1200, 300, 10, 600, { isStatic: true });

    World.add(engine.world, [ground, ceiling, leftWall, rightWall]);

    render.canvas.addEventListener('mousedown', function (e) {
      let mouseposition = [e.clientX, e.clientY];
      let BallsOptions = [[0, 255, 0],[0, 0, 255],[255, 0, 0],[0, 0, 0],[255, 255, 255]];
      let newBall = BallsOptions[Math.floor(Math.random()*BallsOptions.length)];
      setColorName(rgbToColorName(newBall));
      let prediction = knn.predict(newBall);
      
      const smallCircle = Bodies.circle(mouseposition[0], mouseposition[1], 10, {
        restitution: 0,
        render: {
          fillStyle: rgbToHex(newBall),
        },
      });
    
      World.add(engine.world, [smallCircle]);
    
      let dx = prediction[0] - mouseposition[0];
      let dy = prediction[1] - mouseposition[1];
      let distance = Math.sqrt(dx * dx + dy * dy);
      let speed = distance / 150; 
      let velocity = { x: dx / distance * speed, y: dy / distance * speed };
    
      
      function animate() {
        
        let dx = prediction[0] - smallCircle.position.x;
        let dy = prediction[1] - smallCircle.position.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance < 50) { 
         
          Body.setPosition(smallCircle, { x: prediction[0], y: prediction[1] });
          return;
        }
    
        Body.setPosition(smallCircle, { x: smallCircle.position.x + velocity.x, y: smallCircle.position.y + velocity.y });
    
        requestAnimationFrame(animate);
      }
    
    
      animate();
    });

    balls.forEach((pos) => {
      const smallCircle = Bodies.circle(pos[0], pos[1], 10, {
        render: {
          fillStyle: rgbToHex(pos[2]),
        },
      });

      World.add(engine.world, [smallCircle]);
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
  }, [check, knn]);

  return (
    <div>
     <div className='color'> {colorName.toUpperCase()}</div>
      <div ref={sceneRef} />
      <div className='color'> {colorName.toUpperCase()}</div>
    </div>
  );
}

export default Knearestneighbor;
