import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.letters();

const allDifferent = letters => {
  const set = new Set(letters);
  return set.size === letters.length;
}

const solve = (input, length) => {
  for (let i=0; i<input.length-length; i++) {
    const letters = input.slice(i, i+length);
    if (allDifferent(letters)) {
      return i+length;
    }
  }
}

export const part1 = (input) => {
  return solve(input, 4);
}

export const part2 = (input) => {
  return solve(input, 14);
}