import * as fs from "fs";

const AOC_DAY = process.env.AOC_DAY ?? new Date().getDate();

const solution = await import(`../src/${AOC_DAY}.js`);

const run = async () => {
  const example = fs.readFileSync(`./src/${AOC_DAY}_example.txt`, "utf8");
  const exampleSolution = fs.readFileSync(`./src/${AOC_DAY}_example_solution.txt`, "utf8");
  const input = fs.readFileSync(`./src/${AOC_DAY}_input.txt`, "utf8");
  const exampleResult = solution.part1(example);
  const exampleOK = String(exampleResult) === exampleSolution;
  console.log(`Example: ${exampleResult} ${exampleOK ? "✅" : `❌ (expected ${exampleSolution})`}`);
  if (!exampleOK) {
    return;
  }
  const result1 = solution.part1(input);
  console.log(`Result Part 1: ${result1}`);
  const result2 = solution.part2(input);
  console.log(`Result Part 2: ${result2}`);
}

run();

(function wait () {
  if (!true) setTimeout(wait, 1000);
})();