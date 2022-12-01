export const number = <T>(x: T) => {
  if (typeof x !== 'string') {
    return x;
  }
  const r = parseFloat(x);
  return isNaN(r) ? x : r;
};

export const ident = <T>(x: T) => x;
type Fn<T, U> = (x: T) => U;
export const mapFns = <T, U>(fns: Fn<T, U> | Fn<T, U>[]) => {
  if (!Array.isArray(fns)) {
    return (xs: T[]) => xs.map(fns);
  } else {
    return (xs: T[]) => xs.map((x, i) => fns[i < fns.length ? i : fns.length - 1](x));
  }
}
// export const split = <U, T=undefined>(char, fn?:T) => (x: string): T extends Fn<string, infer U> ? U[] : string[] => mapFns(fn ?? ident)(x.split(char)) as T extends Fn<string, infer U> ? U[] : string[]
export const split = (char, fn:any=ident) => (x: string) => mapFns(fn)(x.split(char))
export const lines = (fn:any = ident) => split('\n', fn);
export const list = (fn:any = ident) => split(',', fn);
export const words = (fn:any = ident) => split(' ', fn);
export const blocks = (fn:any = ident) => split('\n\n', fn);
export const grid = (fn:any = ident) => split('\n', split('', fn));
export const equals = (x:any) => (y:any) => x === y;
export const map = <T>(map: Record<string, T>) => (x: string) => map[x] ?? null;
export const fromEntries = (fn:any = ident) => x => Object.fromEntries(fn(x));
export const object = (sep = ',', eq = '=') => fromEntries(split(sep, split(eq)));
export const chain = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);