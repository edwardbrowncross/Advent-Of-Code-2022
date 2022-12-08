import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.grid(p.number);

const bearingsFrom = (x, y, row, col) => {
  return [
    row.slice(0, x).reverse(),
    row.slice(x + 1),
    col.slice(0, y).reverse(),
    col.slice(y + 1),
  ];
}

export const part1 = (input) => {
  return u.map2d(input, (n, y, x, { row, col }) => {
    const peaks = bearingsFrom(x, y, row(), col())
      .map(b => Math.max(...b))
    return peaks.some(h => h < n);
  }).flat().filter(hasView => hasView).length;
}

export const part2 = (input) => {
  return u.map2d(input, (n, y, x, { row, col }) => {
    const views = bearingsFrom(x, y, row(), col())
      .map(b => {
        const d = b.findIndex(h => h >= n);
        if (d >= 0) {
          return d + 1;
        } else {
          return b.length;
        }
      });
    return views.reduce((a, b) => a * b, 1);
  }).flat().reduce((a, b) => Math.max(a, b));
}