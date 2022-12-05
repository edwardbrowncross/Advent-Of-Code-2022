import fs from "fs";
import { exec } from "child_process";
import fetch from "node-fetch";

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

const openFiles = async () => {
  await new Promise((resolve, reject) => {
    exec(`code ./src/${AOC_DAY}.js ./src/${AOC_DAY}_input.txt`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const createSolution = async () => {
  const template = fs.readFileSync("./scripts/template.js", "utf8");
  const solution = template.replace(/{{day}}/g, AOC_DAY);
  fs.writeFileSync(`./src/${AOC_DAY}.js`, solution);
};

const run = async () => {
  await fetchInput();
  await createSolution();

  await openFiles();

  console.log(AOC_URL);
};

run();