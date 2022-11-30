const fs = require("fs");

const AOC_DAY = process.env.AOC_DAY ?? new Date().getDate();

const solution = require(`../src/${AOC_DAY}.js`);

const run = async () => {
  const example = fs.readFileSync(`./src/${AOC_DAY}_example.txt`, "utf8");
  const exampleSolution = fs.readFileSync(`./src/${AOC_DAY}_example_solution.txt`, "utf8");
  const input = fs.readFileSync(`./src/${AOC_DAY}_input.txt`, "utf8");
  const exampleResult = solution.part1(input);
  const exampleOK = String(exampleResult) === exampleSolution;
  console.log(`Example: ${exampleResult} ${exampleOK ? "✅" : `❌ (expected ${exampleSolution})`}`);
  if (!exampleOK) {
    return;
  }
  const result = solution.part1(input);
  console.log(`Result: ${result}`);
}

run();