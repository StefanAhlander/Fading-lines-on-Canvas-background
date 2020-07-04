const backgroundLinesInit = () => {
  let winWidth, winHeight, cursorX = 0, cursorY = 0, points, lastRender;
  const virtualWidth = 1920;
  const virtualHeight = 1080;
  const maxLineLength = 200;
  const numStars = 130;
  const bgColorStart = '#0a080f';
  const bgColorStop = '#2a1b3d';
  const lineColor = '216, 63, 119';
  const canvas = document.querySelector('#canvas');
  const ctx = canvas.getContext('2d');

  const fillScreen = () => {
    const gradient = ctx.createLinearGradient(0, 0, 0, winHeight);
    gradient.addColorStop(0, bgColorStart);
    gradient.addColorStop(1, bgColorStop);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, winWidth, winHeight);
  };

  const drawLine = (p1, p2, color = lineColor) => {
    ctx.strokeStyle = color;
    ctx.strokeWidth = 4;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  };

  const createPoint = () => ({
    x: Math.floor(Math.random() * virtualWidth),
    y: Math.floor(Math.random() * virtualHeight),
    deltaX: Math.random() - 0.5,
    deltaY: Math.random() - 0.5,
  });

  const seedPoints = (num) => Array(num).fill(null).map((e) => createPoint());

  const movePoints = (oldPoints, step = 1) => {
    return oldPoints.map(point => {
      let newPoint = {
        ...point,
        x: point.x + (point.deltaX * step),
        y: point.y + (point.deltaY * step)
      };
      if (newPoint.x <= 0 || newPoint.x >= 1920) {
        newPoint.deltaX = -point.deltaX;
        newPoint.x += (newPoint.deltaX * step);
      }
      if (newPoint.y <= 0 || newPoint.y >= 1080) {
        newPoint.deltaY = -point.deltaY;
        newPoint.y += (newPoint.deltaY * step);
      }
      return newPoint;
    });
  };

  const makeLines = points => {
    let lines = [];
    for (let i = 0, len = points.length - 1; i < len; i++) {
      for (let y = i + 1; y < points.length; y++) {
        const diffX = Math.abs(points[i].x - points[y].x);
        const diffY = Math.abs(points[i].y - points[y].y);
        const hypo = Math.hypot(diffX, diffY);
        if (hypo < maxLineLength) {
          lines.push([points[i], points[y], `rgba(${lineColor}, ${1 - (hypo / maxLineLength)})`]);
        }
      }
    }
    return lines;
  };

  const paintLines = lines => {
    lines.forEach(pointPair => drawLine(pointPair[0], pointPair[1], pointPair[2]));
  };

  const setSize = () => {
    canvas.width = winWidth = window.screen.availWidth;
    canvas.height = winHeight = window.screen.availHeight;
  };

  function getMouseCoordinates(canvas, evt) {
    let rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width / rect.width,
      scaleY = canvas.height / rect.height;

    cursorX = (evt.clientX - rect.left) * scaleX;
    cursorY = (evt.clientY - rect.top) * scaleY;
  }

  const mouseMoveHandler = (evt) => {
    getMouseCoordinates(canvas, evt);
  };

  const render = (timeStamp) => {
    if (lastRender === undefined) {
      lastRender = timeStamp;
    }
    let step = (timeStamp - lastRender) / 8;
    lastRender = timeStamp;

    fillScreen();
    points = movePoints(points, step);
    const pointsWithCursor = [...points];
    pointsWithCursor.push({
      x: cursorX,
      y: cursorY
    });
    const lines = makeLines(pointsWithCursor);
    paintLines(lines);
    window.requestAnimationFrame(render);
  };


  window.onresize = setSize;
  document.querySelector('body').addEventListener('mousemove', mouseMoveHandler);
  setSize();
  points = seedPoints(numStars);
  window.requestAnimationFrame(render);
};

window.onload = backgroundLinesInit;