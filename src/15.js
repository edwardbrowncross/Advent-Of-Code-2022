import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.lines(p.chain(
  p.split(': ',
    p.chain(
      p.split(/,|=/, p.number),
      bits => ({ x: bits[1], y: bits[3] })
    )
  ),
  p.name(['sensor', 'beacon'])
));

const getRadius = ({ sensor, beacon }) => {
  return Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
}

const getIntersection = ({ sensor, beacon }, y) => {
  const radius = getRadius({ sensor, beacon });
  const x = sensor.x;
  const excess = radius - Math.abs(y - sensor.y);
  if (excess < 0) {
    return null;
  }
  return [
    x - excess,
    x + excess,
  ]
}

const mergeRanges = ([range, ...previous], newRange) => {
  if (!range) {
    return [newRange];
  }
  if (newRange[0] > range[1] + 1) {
    return [newRange, range, ...previous];
  }
  const merged = [Math.min(range[0], newRange[0]), Math.max(range[1], newRange[1])];
  return [merged, ...previous];
}

const getRangesIntersecting = (scans, y) => {
  return scans
    .map(({ sensor, beacon }) => getIntersection({ sensor, beacon }, y))
    .filter(p.ident)
    .sort(u.ascendingBy(0))
    .reduce(mergeRanges, [])
}

export const part1 = (input) => {
  const targetRow = input.length < 20 ? 10 : 2000000;

  const numPoints = getRangesIntersecting(input, targetRow)
    .map(([start, end]) => end - start + 1)
    .reduce(u.add, 0);

  const beaconPositions = input
    .filter(({ beacon }) => beacon.y === targetRow)
    .map(({ beacon }) => beacon.x);

  return numPoints - new Set(beaconPositions).size;
}

export const part2 = (input) => {
  const [start, end] = input.length < 20 ? [0, 20] : [0, 4000000]

  for (let y = start; y <= end; y++) {
    const ranges = getRangesIntersecting(input, y)

    if (ranges.length > 1) {
      const x = ranges[0][0] - 1;
      return x * 4000000 + y;
    }
  };
}