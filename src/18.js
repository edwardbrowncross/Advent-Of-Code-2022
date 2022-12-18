import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.lines(p.list(p.number));

const getSize = (coords) => {
  return coords.flat().reduce((acc, x) => Math.max(acc, x), 0) + 1;
}

const createGrid = size => {
  return u.range(0, size).map(
    i => u.range(0, size).map(
      j => u.range(0, size).fill(false)
    )
  );
}

const coordsToGrid = coords => {
  const size = getSize(coords);
  const grid = createGrid(size);
  coords.forEach(([x, y, z]) => grid[z][y][x] = true);
  return grid;
}

const floodFill = (grid, value) => {
  let toDo = [[0, 0, 0]];
  while (toDo.length) {
    let [i, j, k] = toDo.pop();
    if (i < 0 || j < 0 || k < 0 || i >= grid.length || j >= grid.length || k >= grid.length) {
      continue;
    }
    if (grid[i][j][k] !== false) {
      continue;
    }
    grid[i][j][k] = value;
    toDo.push([i, j, k + 1]);
    toDo.push([i, j, k - 1]);
    toDo.push([i, j + 1, k]);
    toDo.push([i, j - 1, k]);
    toDo.push([i + 1, j, k]);
    toDo.push([i - 1, j, k]);
  }
  return grid;
}

const countExposedFaces = (grid, equals = false) => {
  const sides = u.map3d(grid, (x, i, j, k, { u, d, l, r, f, b }) => {
    if (!x) {
      return 0;
    }
    return [u(), d(), l(), r(), f(), b()].filter(x => x === equals).length;
  });
  const totalSides = u.sum(sides.flat(3));
  return totalSides;
};

export const part1 = (input) => {
  const grid = coordsToGrid(input);
  return countExposedFaces(grid);
}

export const part2 = (input) => {
  const grid = floodFill(coordsToGrid(input), null);
  return countExposedFaces(grid, null);
}