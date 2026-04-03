export function escapeRegexp(str: string) {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}