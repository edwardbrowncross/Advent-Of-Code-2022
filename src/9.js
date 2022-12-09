import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.lines(p.words(p.number));

const vectors = {
  'D': [0, -1],
  'U': [0, 1],
  'L': [-1, 0],
  'R': [1, 0],
}

const toString = ([x, y]) => `${x},${y}`;

const follow = (head, tail) => {
  const dif = [head[0] - tail[0], head[1] - tail[1]];
  const len = Math.sqrt(dif[0]*dif[0] + dif[1]*dif[1]);
  if (len < 2) {
    return tail;
  }
  return [tail[0] + Math.sign(dif[0]), tail[1] + Math.sign(dif[1])];
}

const update = ({ knots: [head, ...rest], history }, [x, y]) => {
  head = [head[0] + x, head[1] + y];
  rest = [...rest];
  rest.forEach((knot, i) => {
    const prev = rest[i-1] ?? head;
    rest[i] = follow(prev, knot);
  })
  const tail = rest[rest.length-1];
  history = [...history, toString(tail)];
  return { knots: [head, ...rest], history };
}

const reducer = (state, [dir, len]) => {
  const p = vectors[dir];
  const steps = Array(len).fill(p);
  return steps.reduce(update, state);
}

const initialState = length => ({
  knots: Array(length).fill([0, 0]),
  history: ['0,0'],
})

export const part1 = (input) => {
  const result = input
    .reduce(reducer, initialState(2));
  return new Set(result.history).size;
}

export const part2 = (input) => {
  const result = input
    .reduce(reducer, initialState(10));
  return new Set(result.history).size;
}