export function range(from: number, to: number, inclusive = true) {
  const arr = [];
  const step = from < to ? 1 : -1;
  if (inclusive) to += step;
  for (let i = from; i !== to; i += step) arr.push(i);
  return arr;
}