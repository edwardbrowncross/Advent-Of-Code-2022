import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.lines(
  p.chain(
    p.regex(/Valve ([A-Z]{2}) has flow rate=(\d+); tunnels? leads? to valves? (.+)/, [
      p.ident,
      p.number,
      p.list(p.trim()),
    ]),
    p.name(['name', 'flow', 'tunnels']),
  )
);

const createTree = (allNodes) => {
  const valveNodes = allNodes.filter(x => x.name === 'AA' || x.flow > 0);
  const tree = Object.fromEntries(
    valveNodes.map(({ name, flow }) => [name, {
      flow,
      distances: Object.fromEntries(
        valveNodes
          .filter(({ name: n }) => n !== name)
          .map(({ name: dest }) => [dest, calculateDistance(allNodes, name, dest)])
      )
    }])
  )
  return tree;
}

const calculateDistance = (allNodes, from, to) => {
  const distances = allNodes.map(({ name }) => ({ name, distance: name === from ? 0 : Number.MAX_SAFE_INTEGER, links: [] }));
  distances.forEach(({ name, links }) => {
    const node = allNodes.find(({ name: n }) => n === name);
    node.tunnels.forEach(tunnel => {
      const neighbour = distances.find(({ name: n }) => n === tunnel);
      if (neighbour) {
        links.push(neighbour);
      }
    });
  });
  let todo = [...distances];
  while (todo.length) {
    todo.sort(u.ascendingBy('distance'));
    const current = todo.shift();
    current.links.forEach(neighbour => {
      neighbour.distance = Math.min(neighbour.distance, current.distance + 1);
    });
  }
  return distances.find(({ name }) => name === to).distance;
}

const getValidRoutes = (tree, maxLength = 30) => {
  let activeRoutes = [{ path: ['AA'], distance: 0 }];
  let completePaths = [];
  while (true) {
    if (activeRoutes.length === 0) {
      return completePaths;
    }
    activeRoutes = activeRoutes.flatMap(({ path, distance }) => {
      const last = path[path.length - 1];
      const remainingDistance = maxLength - distance;
      const neighbours = Object.keys(tree[last].distances)
        .filter(x => !path.includes(x))
        .filter(x => tree[last].distances[x] <= remainingDistance);
      if (neighbours.length === 0) {
        completePaths.push(path);
        return [];
      }
      return neighbours.map(n => ({
        path: [...path, n],
        distance: distance + tree[last].distances[n] + 1
      }));
    });
  }

}

const getRouteFlow = (tree, route, time = 30) => {
  let flow = 0;
  let t = time;
  route.forEach((name, i) => {
    if (i === 0) {
      return;
    }
    const distance = tree[route[i - 1]].distances[name];
    t -= distance + 1;
    flow += tree[name].flow * t;
  });
  return flow;
}

const getSubRoutes = (route) => {
  return route.map((x, i) => {
    if (i <= 0) {
      return [];
    }
    return [route.slice(0, i + 1)];
  }).flat(1);
}

const getUniqueSubRoutes = (routes) => {
  const subRoutes = routes.map(getSubRoutes).flat(1);
  return [...new Set(subRoutes.map(x => x.join(',')))].map(x => x.split(','));
}

const isCompatible = (route1, route2) => {
  return route1.every(x => x === 'AA' || !route2.includes(x));
}

const findBestPair = (tree, routes, time = 30) => {
  const preCalculated = routes.map(route => ({
    route,
    flow: getRouteFlow(tree, route, time)
  }));
  let best = 0;
  preCalculated.forEach((r1, i) => {
    preCalculated.slice(i).forEach(r2 => {
      const flow = r1.flow + r2.flow;
      if (flow > best && isCompatible(r1.route, r2.route)) {
        best = flow;
      }
    })
  });
  return best;
}

export const part1 = (input) => {
  const tree = createTree(input);
  const routes = getValidRoutes(tree);
  const flows = routes.map(route => getRouteFlow(tree, route));
  return flows.sort(u.descending)[0];
}

export const part2 = (input) => {
  const tree = createTree(input);
  const routes = getValidRoutes(tree, 26);
  const subRoutes = getUniqueSubRoutes(routes);
  const best = findBestPair(tree, subRoutes, 26);
  return best
}
