function parseInput(input) {
  return input
    .split('\n\n')
    .map(group => group.split('\n').map(x => parseInt(x)));
}

function part1(input) {
  const data = parseInput(input);

  return data
    .map(elf => elf
      .reduce((a, b) => a + b)
    )
    .sort((a, b) => b - a)[0];
}

function part2(input) {
  const data = parseInput(input);

  return data
    .map(elf => elf
      .reduce((a, b) => a + b)
    )
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a + b);
}

module.exports = {
  part1, part2
};