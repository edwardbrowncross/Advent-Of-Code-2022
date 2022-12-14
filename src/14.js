import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.lines(p.split(' -> ', p.chain(p.list(p.number), p.name(['x', 'y']))));

const add = (a, b) => ({
  x: a.x + b.x,
  y: a.y + b.y,
})

const equals = (a, b) => a.x === b.x && a.y === b.y;

const createGrid = (height) => {
  const points = new Set();
  return {
    add: ({ x, y }) => points.add(`${x},${y}`),
    has: ({ x, y }) => points.has(`${x},${y}`),
    points,
    height,
  }
}

const getDirection = (a, b) => {
  return {
    x: Math.sign(b.x - a.x),
    y: Math.sign(b.y - a.y),
  };
}

const drawLine = (grid, from, to) => {
  const dir = getDirection(from, to);
  let p = from;
  while (!equals(p, to)) {
    grid.add(p);
    p = add(p, dir);
  }
  grid.add(to);
  return grid;
}

const drawPath = (grid, path) => {
  for (let i = 0; i < path.length - 1; i++) {
    drawLine(grid, path[i], path[i + 1]);
  }
  return grid;
}

const DOWN = { x: 0, y: 1 };
const RIGHT = { x: 1, y: 1 };
const LEFT = { x: -1, y: 1 };

const getSandDestination = (grid, point, hasFloor = false) => {
  if (grid.has(point)) {
    return null;
  }
  while (true) {
    if (point.y === grid.height) {
      return hasFloor ? point : null;
    } else if (!grid.has(add(point, DOWN))) {
      point = add(point, DOWN);
    } else if (!grid.has(add(point, LEFT))) {
      point = add(point, LEFT);
    } else if (!grid.has(add(point, RIGHT))) {
      point = add(point, RIGHT);
    } else {
      return point;
    }
  }
}

const draw = ({ points, height }, minX, maxX) => {
  const coords = Array.from(points).map(p => p.split(',').map(Number));
  const width = maxX - minX + 1;
  const grid2 = Array(height+1).fill().map(() => Array(width).fill('.'));
  coords.forEach(([x, y]) => {
    if (x >= minX && x <= maxX) {
      grid2[y][x - minX] = '#';
    }
  });
  return grid2.map(row => row.join('')).join('\n');
}

const getMaxSand = (input, hasFloor) => {
  const height = Math.max(...input.flat(1).map(p => p.y)) + 1;
  const grid = input.reduce(drawPath, createGrid(height));

  let n = 0;
  while (true) {
    const sand = getSandDestination(grid, { x: 500, y: 0 }, hasFloor);
    if (sand === null) {
      return n;
    }
    grid.add(sand);
    n++;
  }
}

export const part1 = (input) => {
  return getMaxSand(input, false);
}

export const part2 = (input) => {
  return getMaxSand(input, true);
}