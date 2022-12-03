

export const union = (...lists) => {
  if (lists.length === 1 && Array.isArray(lists[0])) {
    return union(...lists[0]);
  }
  const sets = lists.map(x => new Set(x));
  const s = new Set();
  sets.forEach(x => x.forEach(y => s.add(y)));
  if (Array.isArray(lists[0])) {
    return [...s.values()];
  } else {
    return s;
  }
}

export const intersection = (...lists) => {
  if ((lists.length === 1 || typeof lists[1] === 'number') && Array.isArray(lists[0])) {
    return intersection(...(lists[0]));
  }
  const sets = lists.map(x => new Set(x));
  const s = new Set();
  sets[0].forEach(x => {
    if (sets.every(s => s.has(x))) {
      s.add(x);
    }
  });
  if (Array.isArray(lists[0])) {
    return [...s.values()];
  } else {
    return s;
  }
}

export const splitEvery = (n, arr) => {
  const result = [];
  for (let i = 0; i < arr.length; i += n) {
    result.push(arr.slice(i, i + n));
  }
  return result;
}

export const add = (a, b) => a + b;
export const sum = arr => arr.reduce(add, 0);

// (inclusive)
export const range = (start, end) => new Array(end - start + 1).fill().map((_, i) => start + i);
export const charRange = (start, end) => range(start.charCodeAt(0), end.charCodeAt(0)).map(x => String.fromCharCode(x));