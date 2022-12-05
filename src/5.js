import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

// So much for my neat and concise parsing utils
export const parseInput = p.chain(
  p.blocks([
    p.chain(
      p.grid(),
      grid => {
        return u.transpose(
          grid
            .slice(0, -1)
            .map((row) =>
              row.filter((_, i) => i % 4 === 1)
            )
        ).map(row => row.filter(x => x !== ' '))
      }),
    p.lines(p.chain(
      p.words(p.number),
      x => x.filter(y => typeof y === 'number'),
      p.name(['count', 'from', 'to'])
    )),
  ]),
  p.name(['stacks', 'moves'])
);

const move = reverse => (stacks, { from, to, count }) => {
  const items = stacks[from - 1].splice(0, count);
  if (reverse) {
    items.reverse();
  }
  stacks[to - 1].unshift(...items);
  return stacks;
}

export const part1 = (input) => {
  const stacks = input.moves.reduce(move(true), input.stacks);
  return stacks.map(s => s[0]).join('');
}

export const part2 = (input) => {
  const stacks = input.moves.reduce(move(false), input.stacks);
  return stacks.map(s => s[0]).join('');
}