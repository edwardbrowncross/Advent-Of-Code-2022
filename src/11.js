import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.blocks(p.chain(p.lines([
  x => 0,
  x => p.list(p.number)(x.split(': ')[1]),
  x => x.match(/(\*|\+) (\d+|old)/)?.slice(1).map(p.number),
  x => p.number(x.match(/\d+/)?.[0]),
  x => p.number(x.match(/\d/)?.[0]),
  x => p.number(x.match(/\d/)?.[0]),
]), p.name([
  'inspected',
  'items',
  'op',
  'divisor',
  'ifTrue',
  'ifFalse',
])));

const doOp = (value, [op, operand]) => {
  let realOperand = operand !== 'old' ? operand : value;
  if (op === '+') {
    return (value + realOperand);
  } else if (op === '*') {
    return (value * realOperand);
  }
  throw new Error('Unknown op: ' + op);
}

const relax = (value, level) => Math.floor(value / level) ;

const getPassTarget = (value, { divisor, ifTrue, ifFalse }) => {
  if (value % divisor === 0) {
    return ifTrue;
  } else {
    return ifFalse;
  }
}

const simulateRound = (monkeys, relaxLevel=3, universalDivisor=null) => {
  let newMonkeys = u.deepCopy(monkeys);
  for (let i = 0; i < newMonkeys.length; i++) {
    let monkey = newMonkeys[i];
    monkey.inspected += monkey.items.length;
    let items = monkey.items.splice(0)
      .map(x => relax(doOp(x, monkey.op), relaxLevel))
      .map(x => universalDivisor ? x%universalDivisor : x);
    items.forEach(item => {
      let target = getPassTarget(item, monkey);
      newMonkeys[target].items.push(item);
    })
  }
  return newMonkeys;
}

const calculateScore = (monkeys) => monkeys
  .map(m => m.inspected)
  .sort(u.descending)
  .slice(0, 2)
  .reduce((a, b) => a * b)

const getUniversalDivisor = (monkeys) => monkeys
  .map(m => m.divisor)
  .reduce((a, b) => a * b);

export const part1 = (input) => {
  let monkeys = input;
  for (let round=0; round<20; round++) {
    monkeys = simulateRound(monkeys, 3);
  }

  return calculateScore(monkeys);
}

export const part2 = (input) => {
  let monkeys = input;
  const divisor = getUniversalDivisor(monkeys);
  for (let round=0; round<10000; round++) {
    monkeys = simulateRound(monkeys, 1, divisor);
  }

  return calculateScore(monkeys);
}