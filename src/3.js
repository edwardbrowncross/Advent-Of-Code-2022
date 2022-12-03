import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

const letters = ['_', ...u.charRange('a', 'z'), ...u.charRange('A', 'Z')];

export const parseInput = p.lines(p.letters(l => letters.indexOf(l)));

export const part1 = (input) => {
  const data = parseInput(input);
  const extra = data
    .map(items => u.splitEvery(items.length/2, items))
    .flatMap(u.intersection);
  const sum = u.sum(extra);
  return sum;
}

export const part2 = (input) => {
  const data = parseInput(input);
  const groups = u.splitEvery(3, data);
  const badges = groups.flatMap(u.intersection);
  const sum = u.sum(badges);
  return sum;
}