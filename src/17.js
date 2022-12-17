import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.letters(x => x === '>' ? 1 : -1);

const shapes = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [0, 1],
    [1, 0],
    [1, 1],
    [2, 1],
    [1, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
];

const movePoints = (points, [x, y]) => {
  return points.map(([px, py]) => [px + x, py + y]);
}
const moveHorizontal = (points, direction) => {
  return movePoints(points, [direction, 0]);
}
const moveDown = (points) => {
  return movePoints(points, [0, -1]);
}
const pointToIndex = ([x, y]) => `${y},${x}`;
const checkCollision = (points, world) => {
  return points.some(p =>
    p[0] <= 0 || p[0] > 7 || p[1] <= 0 || world.has(pointToIndex(p))
  );
}

const draw = world => {
  const coords = [...world].sort().map(s => s.split(',').map(Number));
  const max = coords.reduce((max, [y]) => Math.max(y, max), 0);
  for (let i = max; i > 0; i--) {
    let s = "";
    for (let j = 1; j <= 7; j++) {
      s += world.has(`${i},${j}`) ? '#' : '.';
    }
    console.log(s);
  }
}

const simulateNextShape = ({ tick, shape, world, height, topRow, history }, directions) => {
  let points = movePoints(shapes[shape % 5], [3, height + 4]);
  let dx = 0;
  let dy = 0;
  while (true) {
    const direction = directions[tick % directions.length];
    tick++;
    const afterHorizontal = moveHorizontal(points, direction);
    if (!checkCollision(afterHorizontal, world)) {
      dx += direction;
      points = afterHorizontal
    }
    const afterDrop = moveDown(points);
    if (!checkCollision(afterDrop, world)) {
      points = afterDrop;
      dy++;
    } else {
      const shapeHeight = Math.max(...points.map(p => p[1]))
      return {
        tick,
        shape: shape + 1,
        height: Math.max(height, shapeHeight),
        world: new Set([...world, ...points.map(pointToIndex)]),
        history: [...history, `${dx},${dy}`]
      }
    }
  }
}

const prune = (state, distance) => {
  return {
    ...state,
    world: new Set([...state.world].filter(s => state.height - s.split(',').map(Number)[0] < distance)),
  }
}

const createState = () => ({
  tick: 0,
  shape: 0,
  height: 0,
  world: new Set(),
  history: [],
})

const simulate = (input, steps) => {
  let state = createState();
  for (let i = 0; i < steps; i++) {
    state = simulateNextShape(state, input);
    if (i % 100 === 0) {
      state = prune(state, 100);
    }
  }
  return state;
}

export const part1 = (input) => {
  return simulate(input, 2022).height;
}

export const part2 = (input) => {
  const state_10000 = simulate(input, 10000);
  const historyBlocks = u.splitEvery(5, state_10000.history).map(h => h.join(' '));
  const lastBlock = historyBlocks[historyBlocks.length - 1];
  const occurrences = historyBlocks.flatMap((h, i) => h === lastBlock ? [i] : []);
  const period = 5*(occurrences[1] - occurrences[0]);
  
  const lowI = 1000000000000%period + period;
  const highI = 1000000000000%period + period*2;
  const lowState = simulate(input, lowI);
  const highState = simulate(input, highI)

  const rise = highState.height - lowState.height;
  const gradient = rise / period;
  const offset = lowState.height - gradient * lowI;
  
  return Math.round(1000000000000 * gradient + offset);
}