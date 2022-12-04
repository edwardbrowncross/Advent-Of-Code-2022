import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.lines(p.list(
  p.chain(
    p.split('-', p.number),
    ns => u.range(...ns)
  )
));

export const part1 = (input) => {
  const data = parseInput(input);
  const encompassing = data
    .filter(([a, b]) =>
      u.intersection(a, b).length === Math.min(a.length, b.length)
    );

  return encompassing.length;
}

export const part2 = (input) => {
  const data = parseInput(input);
  const overlapping = data
    .filter(([a, b]) =>
      u.intersection(a, b).length > 0
    );

  return overlapping.length;
}