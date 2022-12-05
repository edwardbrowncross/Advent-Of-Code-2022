import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.chain(p.blocks([
  p.chain(p.grid(), grid => {
    return u.transpose(
      grid
        .slice(0, -1)
        .map((row) => row.filter((_, i) => i % 4 === 1))
    );
  }),
  p.lines(p.chain(p.words(p.number), x => x.filter(y => typeof y === 'number'), p.name(['count', 'from', 'to']))),
]), p.name(['stacks', 'moves']));

export const part1 = (input) => {


  return;
}

export const part2 = (input) => {


  return;
}