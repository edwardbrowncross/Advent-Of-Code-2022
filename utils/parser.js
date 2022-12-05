export const number = x => {
  const r = parseFloat(x);
  return isNaN(r) ? x : r;
};
export const ident = x => x;
export const mapFns = fns => {
  if (!Array.isArray(fns)) {
    return xs => xs.map(fns);
  } else {
    return xs => xs.map((x, i) => fns[i < fns.length ? i : fns.length-1](x));
  }
}
export const split = (char, fn=ident) => (x) => mapFns(fn)(x.split(char))
export const lines = (fn = ident) => split('\n', fn);
export const list = (fn = ident) => split(',', fn);
export const words = (fn = ident) => split(' ', fn);
export const letters = (fn = ident) => split('', fn);
export const blocks = (fn = ident) => split('\n\n', fn);
export const grid = (fn = ident) => lines(letters(fn));
export const equals = (x) => (y) => x === y;
export const map = (map) => (x) => map[x] ?? null;
export const fromEntries = (fn = ident) => x => Object.fromEntries(fn(x));
export const object = (sep = ',', eq = '=') => fromEntries(split(sep, split(eq)));
export const chain = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);
export const name = (names) => (arr) => Object.fromEntries(names.map((name, i) => [name, arr[i]]));