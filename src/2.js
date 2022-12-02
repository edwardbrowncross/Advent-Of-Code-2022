import * as p from '../utils/parser.js';

export function parseInput(input) {
  return p.lines(p.words(p.map({
    'A':  0, 'X': 0,
    'B':  1, 'Y': 1,
    'C':  2, 'Z': 2,
  })))(input);
}

const scoreRound = ([p1, p2]) => {
  let outcome;
  if (p1 == p2) {
    outcome = 3;
  } else if (p2 == (p1+1)%3) {
    outcome = 6;
  } else {
    outcome = 0;
  }
  return outcome + p2 + 1;
}

const scoreAllRounds = rounds => {
  return rounds.reduce((s, round) =>s + scoreRound(round), 0);
}

export function part1(input) {
  const data = parseInput(input);

  return scoreAllRounds(data);
}

export function part2(input) {
  const data = parseInput(input);
  
  const plays = data.map(([p1, outcome]) => {
    if (outcome === 0) {
      return [p1, (p1+2)%3];
    } else if (outcome === 1) {
      return [p1, p1];
    } else {
      return [p1, (p1+1)%3];
    }
  })
  
  return scoreAllRounds(plays);
}