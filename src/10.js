import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.lines(p.words(p.number));

const operations = {
  'noop': ({ value, time}) => [{ value, time: time + 1 }],
  'addx': ({ value, time }, param) => [{ value, time: time + 1 }, { value: value + param, time: time + 2 }],
}

const createState = () => ({
  value: 1,
  time: 0,
})

const reducer = (history, [op, param]) => {
  const fn = operations[op];
  const current = history[history.length-1];
  const next = fn(current, param);
  return [...history, ...next];
}

export const part1 = (input) => {
  const history = input.reduce(reducer, [createState()])
  const interesting = [20, 60, 100, 140, 180, 220];

  return u.sum(interesting.map(t => history[t-1].value * t));
}

const willDraw = ({ value, time }) => Math.abs(value - time%40) <= 1;

const draw = (history) => {
  const pixels = history.map(h => willDraw(h) ? '█' : ' ');
  return u.splitEvery(40, pixels)
    .map(row => row.join(''))
    .join('\n');
}

export const part2 = (input) => {
  const history = input.reduce(reducer, [createState()])
  const image = draw(history);
  console.log(image);
  return null;
}