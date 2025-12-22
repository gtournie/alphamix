

// export default function transformInt(paramType: "params" | "query" | "body", props: string | string[])  {
//   props = Array.isArray(props) ? props : [props];
//   props = props.map(prop => `context.${paramType}.${prop} = +context.${paramType}.${prop};`)
//   return new Function("context", props.join("")).bind(null);
// }