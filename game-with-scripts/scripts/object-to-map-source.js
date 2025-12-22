export default function objectToMapSource(obj) {
  let content = "const m = new Map();";
  Object.keys(obj).forEach(k => {
    content += `\nm.set(${JSON.stringify(k)}, ${JSON.stringify(obj[k])});`;
  });
  return content + "\nexport default m;";
}