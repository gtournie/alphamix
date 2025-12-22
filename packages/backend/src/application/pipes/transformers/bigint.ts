// import { toBigInt } from "../../../lib/number";

// Not needed anymore

// export default function transformBigInt(paramType: "user" | "params" | "query" | "body", props: string | string[]) {
//   props = Array.isArray(props) ? props : [props];
//   props = props.map(prop => `context.${paramType}.${prop} = toBigInt(context.${paramType}.${prop});`)
//   return new Function("toBigInt", "context", props.join("")).bind(null, toBigInt);
// }
