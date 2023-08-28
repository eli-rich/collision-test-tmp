import P5 from 'p5';
import './style.css';

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
};

const KEYS = {
  W: 87,
  A: 65,
  S: 83,
  D: 68,
} as const;

const sketch = (p5: P5) => {
  const player: Rectangle = {
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    angle: 45,
  };

  const box: Rectangle = {
    x: -250,
    y: 0,
    width: 100,
    height: 100,
    angle: 45,
  };

  const rectangles = [player, box];

  const move = (key: (typeof KEYS)[keyof typeof KEYS]) => {
    if (p5.keyIsDown(key)) {
      switch (key) {
        case 87: // W
          player.y -= 5;
          break;
        case 65: // A
          player.x -= 5;
          break;
        case 83: // S
          player.y += 5;
          break;
        case 68: // D
          player.x += 5;
      }
    }
  };

  const isRectColliding = (rect1: Rectangle, rect2: Rectangle): boolean => {
    // what the hell
  };

  p5.setup = () => {
    // create canvas
    const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent('app');

    p5.frameRate(60);
    p5.background('white');
    p5.angleMode('degrees');
    p5.rectMode('center');
  };

  p5.draw = () => {
    p5.background('white');
    p5.translate(window.innerWidth / 2, window.innerHeight / 2);
    move(KEYS['W']);
    move(KEYS['A']);
    move(KEYS['S']);
    move(KEYS['D']);
    // set player angle to always point to mouse
    // make sure to account for player position
    player.angle = p5.atan2(
      p5.mouseY - player.y - window.innerHeight / 2,
      p5.mouseX - player.x - window.innerWidth / 2,
    );
    rectangles.forEach(rect => {
      p5.push();
      p5.translate(rect.x, rect.y);
      p5.rotate(rect.angle);
      p5.rect(0, 0, rect.width, rect.height);
      p5.pop();
    });
    // check for collisions between rectangles
    if (isRectColliding(box, player)) p5.fill('red');
    else p5.fill('black');
  };
};

new P5(sketch);
