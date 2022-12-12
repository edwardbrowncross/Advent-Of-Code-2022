import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

const heights = u.charRange('a', 'z');
const getHeight = char => {
  if (char === 'S') {
    char = 'a';
  }
  if (char === 'E') {
    char = 'z';
  }
  return heights.indexOf(char);
}
const getInitialDistance = char => char === 'S' ? 0 : Number.MAX_SAFE_INTEGER;

export const parseInput = input => {
  const grid = p.grid()(input);
  const start = u.findIndex2d(grid, x => x === 'S');
  const end = u.findIndex2d(grid, x => x === 'E');

  return {
    grid: u.map2d(grid, char => ({
      height: getHeight(char),
      distance: getInitialDistance(char),
    })),
    start,
    end
  };
}

const canMove = (from, to) => {
  return to - from <= 1
}

const linkGrid = (grid) => {
  u.map2d(grid, (x, i, j, { u, d, l, r }) => {
    x.links = [];
    [u(), d(), l(), r()].forEach(neighbour => {
      if (neighbour !== null && canMove(x.height, neighbour.height)) {
        x.links.push(neighbour);
      }
    });
  });
}

const assignDistances = (grid) => {
  let todo = grid.flat();
  while (todo.length) {
    todo.sort(u.ascendingBy('distance'));
    const current = todo.shift();
    current.links.forEach(neighbour => {
      neighbour.distance = Math.min(neighbour.distance, current.distance + 1);
    });
  }
}

export const part1 = ({ grid, end }) => {
  grid = u.deepCopy(grid);
  linkGrid(grid);
  assignDistances(grid);

  return grid[end[0]][end[1]].distance;
}

export const part2 = ({ grid, end }) => {
  grid = u.deepCopy(grid);
  linkGrid(grid);
  u.forEach2d(grid, x => {
    if (x.height === 0) {
      x.distance = 0;
    }
  });
  assignDistances(grid);
  
  return grid[end[0]][end[1]].distance;
}