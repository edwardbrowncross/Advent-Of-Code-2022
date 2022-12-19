import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.trimSplit(/Blueprint \d+:\s+/, p.chain(
  x => x.replaceAll('\n', ''),
  p.split(/\.\s+/,
    recipe => ['ore', 'clay', 'obsidian', 'geode'].map(x =>
      Number(recipe.match(new RegExp(`(\\d+) ${x}`))?.[1]) || 0)
  ),
));

const getBuildOptions = (resources, costs) => {
  return costs.map((cost) =>
    cost.every((x, i) => x <= resources[i])
  );
}

const buildRobot = (state, costs, i) => {
  const newResources = state.resources.map((x, j) => x - costs[i][j]);
  const otherBuildOptions = getBuildOptions(newResources, costs);
  return {
    ...state,
    robots: state.robots.map((x, j) => j === i ? x + 1 : x),
    resources: newResources,
    choseNotToBuild: state.choseNotToBuild.map((x, j) => x && otherBuildOptions[j]),
  }
};

const gatherResources = (state, robots) => ({
  ...state,
  resources: state.resources.map((x, i) => x + robots[i]),
})

const isBetterThan = (state1, comprehensive = false) => (state2) => {
  if (state2.resources[3] - state1.resources[3] >= 3) {
    return true;
  }
  if (state1 === state2) {
    return false;
  }
  return comprehensive ? state2.robots.every((x, i) => x >= state1.robots[i]) && state2.resources.every((x, i) => x >= state1.resources[i]) : false;
}

const getNextStates = (state, costs) => {
  const nextBuildOptions = getBuildOptions(state.resources, costs);
  if (state.robots[0] === 4) {
    nextBuildOptions[0] = false;
  }
  if (state.robots[1] === costs[2][1]) {
    nextBuildOptions[1] = false;
  }
  const newBuildOptions = nextBuildOptions.flatMap((x, i) => x && !state.choseNotToBuild[i] ? [i] : []);
  const doNothing = { ...state, choseNotToBuild: nextBuildOptions };
  const builds = newBuildOptions.map(i => buildRobot(state, costs, i));
  if (nextBuildOptions[3]) {
    return [buildRobot(state, costs, 3)].map(s => gatherResources(s, state.robots));
  } else {
    return [doNothing, ...builds].map(s => gatherResources(s, state.robots));
  }
}

const simulateCosts = (costs, iter = 24) => {
  let paths = [{
    robots: [1, 0, 0, 0],
    resources: [0, 0, 0, 0],
    choseNotToBuild: [false, false, false, false],
  }];
  for (let i = 0; i < iter; i++) {
    let nextPaths = [];
    for (let state of paths) {
      nextPaths.push(...getNextStates(state, costs));
    }
    paths = []
    for (let path of nextPaths) {
      if (!nextPaths.some(isBetterThan(path, nextPaths.length < 5000))) {
        paths.push(path);
      }
    }
  }
  return paths;
}

export const part1 = (input) => {
  const geodes = input
    .map(costs => simulateCosts(costs, 24)
      .map(x => x.resources[3])
      .sort(u.descending)[0]
    );
  const score = u.sum(geodes.map((x, i) => x * (i + 1)));
  return score;
}

export const part2 = (input) => {
  const geodes = input.slice(0, 3)
    .map(costs => simulateCosts(costs, 32)
      .map(x => x.resources[3])
      .sort(u.descending)[0]
    );
  return geodes.reduce((a, b) => a * b, 1);
}