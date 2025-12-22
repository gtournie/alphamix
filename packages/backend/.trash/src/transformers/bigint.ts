import { toBigInt } from "../lib/number";

export default function transformBigInt(props: string[]) {
  return  ({ params }: any) => props.forEach(prop => params[prop] = toBigInt(params[prop]) as never);
}
