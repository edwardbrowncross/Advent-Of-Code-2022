import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

const createDirectory = (parent) => {
  return {
    parent,
    files: {},
    folders: {},
  }
}

const parsers = {
  "\\$ cd \\.\\.": (state) => {
    if (!state.pwd.parent) throw new Error("Already at root");
    return {
      ...state,
      pwd: state.pwd.parent,
    }
  },
  "\\$ cd (.+)": (state, dir) => {
    if (!state.pwd.folders[dir]) throw new Error(`No such directory ${dir}`);
    return {
      ...state,
      pwd: state.pwd.folders[dir],
    }
  },
  "\\$ ls": (state) => state,
  "(\\d+) (.+)": (state, size, name) => {
    state.pwd.files[name] = parseInt(size);
    return state;
  },
  "dir (.+)": (state, dir) => {
    const newFolder = createDirectory(state.pwd);
    state.pwd.folders[dir] = newFolder;
    state.dirs.push(newFolder)
    return state;
  },
}

export const parseInput = p.chain(
  p.lines(),
  lines => {
    const root = createDirectory(null);
    return lines.slice(1)
      .reduce((state, command) => {
        const parser = Object.entries(parsers).find(([regex]) => command.match(regex));
        if (!parser) {
          throw new Error(`No parser found for command ${command}`);
        }
        const [pattern, fn] = parser;
        const [_, ...args] = command.match(pattern);
        return fn(state, ...args);
      }, {
        root,
        pwd: root,
        dirs: [root],
      })
  }
);

const dirSize = dir => {
  return u.sum(Object.values(dir.files)) +
    u.sum(Object.values(dir.folders).map(dirSize));
}

export const part1 = (input) => {
  return input.dirs.map(dirSize)
    .filter(size => size <= 100000)
    .reduce(u.add);
}

export const part2 = (input) => {
  const free = 70000000 - dirSize(input.root);
  const required = 30000000 - free;
  return input.dirs.map(dirSize)
    .filter(size => size >= required)
    .sort(u.ascending)[0]
}