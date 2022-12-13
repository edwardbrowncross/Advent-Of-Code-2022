import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.blocks(p.lines(x => JSON.parse(x)));

const compare = (a, b) => {
  if (!Array.isArray(a) && !Array.isArray(b)) {
    if (a < b) {
      return true;
    }
    if (a > b) {
      return false;
    }
    return null;
  }
  if (!Array.isArray(a)) {
    a = [a]
  }
  if (!Array.isArray(b)) {
    b = [b]
  }
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    let result = compare(a[i], b[i]);
    if (result !== null) {
      return result;
    }
  }
  if (a.length < b.length) {
    return true;
  }
  if (a.length > b.length) {
    return false;
  }
  return null;
}

export const part1 = (input) => {
  return input
    .map(([a, b]) => compare(a, b))
    .map((ok, i) => ok ? i + 1 : 0)
    .reduce(u.add, 0);
}

export const part2 = (input) => {
  input = [...input.flat(1), [[2]], [[6]]];
  input.sort((a, b) => compare(a, b) ? -1 : 1);

  return input
    .map(x => JSON.stringify(x))
    .map((x, i) => x === '[[2]]' || x === '[[6]]' ? i + 1 : 1)
    .reduce(u.multiply, 1);
}