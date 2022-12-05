

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

// takes sets, arrays, an array of sets or arrays
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

export const ascending = (a, b) => a - b;
export const descending = (a, b) => b - a;
export const ascendingBy = key => (a, b) => a[key] - b[key];
export const descendingBy = key => (a, b) => b[key] - a[key];

export const map = (arr, fn, { circular = false } = {}) => {
  return arr.map((x, i) => {
    const delta = j => {
      if (i + j > 0 && i + j < arr.length) {
        return arr[i + j];
      } else if (circular) {
        return arr[(i + j + arr.length) % arr.length];
      } else {
        return null;
      }
    }
    const extra = {
      delta,
      l: (n=1) => delta(-n),
      r: (n=1) => delta(n),
    }
    return fn(x, i, extra);
  })
}

export const map2d = (arr, fn, { circular = false } = {}) => {
  return arr.map((row, i) => {
    return row.map((x, j) => {
      const delta = (di, dj) => {
        if (i + di > 0 && i + di < arr.length && j + dj > 0 && j + dj < row.length) {
          return arr[i + di][j + dj];
        } else if (circular) {
          return arr[(i + di + arr.length) % arr.length][(j + dj + row.length) % row.length];
        } else {
          return null;
        }
      }
      const extra = {
        delta,
        l: (n=1) => delta(0, -n),
        r: (n=1) => delta(0, n),
        u: (n=1) => delta(-n, 0),
        d: (n=1) => delta(n, 0),
      }
      return fn(x, i, j, extra);
    });
  });
}

export const transpose = arr => arr[0].map((_, i) => arr.map(row => row[i]));