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
    // determine if two rectangles are colliding
    // make sure to account for canvas rotation and translation done by p5
    // angle is in degrees
    const rect1Points = [
      { x: rect1.x - rect1.width / 2, y: rect1.y - rect1.height / 2 },
      { x: rect1.x + rect1.width / 2, y: rect1.y - rect1.height / 2 },
      { x: rect1.x + rect1.width / 2, y: rect1.y + rect1.height / 2 },
      { x: rect1.x - rect1.width / 2, y: rect1.y + rect1.height / 2 },
    ];
    const rect2Points = [
      { x: rect2.x - rect2.width / 2, y: rect2.y - rect2.height / 2 },
      { x: rect2.x + rect2.width / 2, y: rect2.y - rect2.height / 2 },
      { x: rect2.x + rect2.width / 2, y: rect2.y + rect2.height / 2 },
      { x: rect2.x - rect2.width / 2, y: rect2.y + rect2.height / 2 },
    ];

    const rect1RotatedPoints = rect1Points.map(point => {
      const x = point.x * p5.cos(rect1.angle) - point.y * p5.sin(rect1.angle) + rect1.x;
      const y = point.x * p5.sin(rect1.angle) + point.y * p5.cos(rect1.angle) + rect1.y;
      return { x, y };
    });
    const rect2RotatedPoints = rect2Points.map(point => {
      const x = point.x * p5.cos(rect2.angle) - point.y * p5.sin(rect2.angle) + rect2.x;
      const y = point.x * p5.sin(rect2.angle) + point.y * p5.cos(rect2.angle) + rect2.y;
      return { x, y };
    });
    const rect1Edges = [
      {
        x1: rect1RotatedPoints[0].x,
        y1: rect1RotatedPoints[0].y,
        x2: rect1RotatedPoints[1].x,
        y2: rect1RotatedPoints[1].y,
      },
      {
        x1: rect1RotatedPoints[1].x,
        y1: rect1RotatedPoints[1].y,
        x2: rect1RotatedPoints[2].x,
        y2: rect1RotatedPoints[2].y,
      },
      {
        x1: rect1RotatedPoints[2].x,
        y1: rect1RotatedPoints[2].y,
        x2: rect1RotatedPoints[3].x,
        y2: rect1RotatedPoints[3].y,
      },
      {
        x1: rect1RotatedPoints[3].x,
        y1: rect1RotatedPoints[3].y,
        x2: rect1RotatedPoints[0].x,
        y2: rect1RotatedPoints[0].y,
      },
    ];
    const rect2Edges = [
      {
        x1: rect2RotatedPoints[0].x,
        y1: rect2RotatedPoints[0].y,
        x2: rect2RotatedPoints[1].x,
        y2: rect2RotatedPoints[1].y,
      },
      {
        x1: rect2RotatedPoints[1].x,
        y1: rect2RotatedPoints[1].y,
        x2: rect2RotatedPoints[2].x,
        y2: rect2RotatedPoints[2].y,
      },
      {
        x1: rect2RotatedPoints[2].x,
        y1: rect2RotatedPoints[2].y,
        x2: rect2RotatedPoints[3].x,
        y2: rect2RotatedPoints[3].y,
      },
      {
        x1: rect2RotatedPoints[3].x,
        y1: rect2RotatedPoints[3].y,
        x2: rect2RotatedPoints[0].x,
        y2: rect2RotatedPoints[0].y,
      },
    ];
    for (let i = 0; i < rect1Edges.length; i++) {
      for (let j = 0; j < rect2Edges.length; j++) {
        const x1 = rect1Edges[i].x1;
        const y1 = rect1Edges[i].y1;
        const x2 = rect1Edges[i].x2;
        const y2 = rect1Edges[i].y2;
        const x3 = rect2Edges[j].x1;
        const y3 = rect2Edges[j].y1;
        const x4 = rect2Edges[j].x2;
        const y4 = rect2Edges[j].y2;
        const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
          return true;
        }
      }
    }
    return false;
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
