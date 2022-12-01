const fs = require("fs");
const { exec } = require("child_process");
const fetch = require("node-fetch");
const cheerio = require('cheerio');

const AOC_YEAR = process.env.AOC_YEAR ?? new Date().getFullYear();
const AOC_DAY = process.env.AOC_DAY ?? new Date().getDate();
const AOC_SESSION = process.env.AOC_SESSION;

const AOC_URL = `https://adventofcode.com/${AOC_YEAR}/day/${AOC_DAY}`;

const fetchInput = async () => {
  const response = await fetch(`${AOC_URL}/input`, {
    headers: {
      Cookie: `session=${AOC_SESSION}`,
    },
  });
  const input = await response.text();
  fs.writeFileSync(`./src/${AOC_DAY}_input.txt`, input.trim());
};

const fetchExample = async () => {
  const response = await fetch(`${AOC_URL}`, {
    headers: {
      Cookie: `session=${AOC_SESSION}`,
    },
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  // Find the first pre tag after the word example appears in the text
  const example = $('p:contains("example")').eq(0).next('pre').text();
  // Finds the last bold code in part 1
  const solution = $('.day-desc').first().find('code em, em code').last().text();
  fs.writeFileSync(`./src/${AOC_DAY}_example.txt`, example.trim());
  fs.writeFileSync(`./src/${AOC_DAY}_example_solution.txt`, solution.trim());
}

const openFiles = async () => {
  await new Promise((resolve, reject) => {
    exec(`code ./src/${AOC_DAY}.ts ./src/${AOC_DAY}_input.txt ./src/${AOC_DAY}_example.txt`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const createSolution = async () => {
  const template = fs.readFileSync("./scripts/template.ts", "utf8");
  const solution = template.replace(/{{day}}/g, AOC_DAY);
  fs.writeFileSync(`./src/${AOC_DAY}.ts`, solution);
};

const run = async () => {
  await fetchInput();
  await fetchExample();
  await createSolution();

  await openFiles();

  console.log(AOC_URL);
};

run();