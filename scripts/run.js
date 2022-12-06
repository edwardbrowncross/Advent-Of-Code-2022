import * as fs from "fs";
import fetch from "node-fetch";
import chokidar from "chokidar";
import { load } from 'cheerio';

const AOC_YEAR = process.env.AOC_YEAR ?? new Date().getFullYear();
const AOC_DAY = process.env.AOC_DAY ?? new Date().getDate();
const AOC_SESSION = process.env.AOC_SESSION;

const AOC_URL = `https://adventofcode.com/${AOC_YEAR}/day/${AOC_DAY}`;

// May I be forgiven for this lazy use of global variables and the spaghetti code it produces 🙏
let example, solution1, solution2, done1, done2;
let input;
const incorrectAnswers = [null, [],[]]

const loadWebData = async () => {
  const response = await fetch(`${AOC_URL}`, {
    headers: {
      Cookie: `session=${AOC_SESSION}`,
    },
  });
  const html = await response.text();
  const $ = load(html);
  // Find the first pre tag after the word example appears in the text
  example = $('p:contains("example")').eq(0).next('pre').text().replace(/\n$/, '');
  // Finds the last bold code in part 1
  solution1 = process.env.AOC_SOLUTION_1 ?? $('.day-desc').eq(0).find('code em, em code').last().text();
  done1 = $('p:contains("Your puzzle answer was")').length >= 1;
  solution2 = process.env.AOC_SOLUTION_2 ?? $('.day-desc').eq(1).find('code em, em code').last().text();
  done2 = $('p:contains("Your puzzle answer was")').length >= 2;
}

const loadCode = async () => {
  const cacheBustingModulePath = `../src/${AOC_DAY}.js?update=${Date.now()}`
  return (await import(cacheBustingModulePath));
}

const loadInput = () => {
  return fs.readFileSync(`./src/${AOC_DAY}_input.txt`, "utf8");
}

const submitAnswer = async (answer, part) => {
  if (incorrectAnswers[part].includes(answer)) {
    console.log("You already submitted this answer (and it was wrong)");
    return false;
  }
  console.log('Submitting answer...');
  const res = await fetch(`${AOC_URL}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': `session=${AOC_SESSION}`,
    },
    body: `level=${part}&answer=${answer}`,
  });
  const html = await res.text();
  const $ = load(html);
  const message = $('article p').text().trim();
  if (message.includes(`That's not the right answer`)) {
    console.log(`😢 Incorrect`);
    incorrectAnswers[part].push(answer);
    return false;
  } else if (message.includes('You gave an answer too recently')) {
    const [_, t] = message.match(/You have (\d+)s left to wait/)
    console.log(`⌚ Waiting ${t}s for next attempt`);
    await new Promise(r => setTimeout(r, (t + 1) * 1000));
    return await submitAnswer(answer, part);
  } else if (message.includes(`That's the right answer`)) {
    console.log(`🎉 Correct!`);
    await loadWebData();
    return true;
  } else {
    throw new Error(`Unknown message: ${message}`);
  }
}

const clone = obj => JSON.parse(JSON.stringify(obj));

const checkExample = (input, expected, fn) => {
  const result = fn(clone(input));
  const ok = String(result) === expected;
  console.log(`Example: \t${result} \t${ok ? "✅" : `❌ (expected ${expected})`}`);
  return ok;
}

const runRealInput = (input, done, fn) => {
  const result = fn(clone(input));
  console.log(`Result: \t${result} \t${done ? "✅" : "❌"}`);
  return result;
}

const onCodeChange = async () => {
  console.clear();

  const code = await loadCode();

  let parsedExample, parsedInput;
  try {
    parsedExample = code.parseInput(example);
    parsedInput = code.parseInput(input);
  } catch (e) {
    console.log("Error parsing input");
    console.log(e);
    return;
  }

  
  console.log('--------- Part 1 ---------');
  try {
    // Check whether part1 actually returns something
    if (code.part1(clone(parsedExample)) === undefined) {
      console.log(JSON.stringify(parsedExample));
      console.log("Part 1 returning undefined");
      return;
    }

    const exampleOk = checkExample(parsedExample, solution1, code.part1);
    if (!exampleOk) {
      return;
    }
    const result = runRealInput(parsedInput, done1, code.part1);
    if (!done1) {
      await submitAnswer(result, 1);
    }
  } catch (e) {
    console.log("Error");
    console.log(e);
    return;
  }

  if (!done1) {
    return;
  }

  console.log('');
  console.log('--------- Part 2 ---------');
  try {
    const exampleOk = checkExample(parsedExample, solution2, code.part2);
    if (!exampleOk) {
      // return;
    }
    const result = runRealInput(parsedInput, done2, code.part2);
    if (!done2) {
      await submitAnswer(result, 2);
    }
  } catch (e) {
    console.log("Error");
    console.log(e);
    return;
  }
};

const run = async () => {
  await loadWebData();
  input = loadInput();

  chokidar.watch(`./src/${AOC_DAY}.js`).on('change', onCodeChange);
  await onCodeChange();
}

run();