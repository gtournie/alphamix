import { ValueError } from "@sinclair/typebox/errors"

export default function convertTypeBoxValidationErrors(errors: ValueError[]) {
  return errors.reduce((h: Record<string, unknown>, e: ValueError) => {
    h[e.path.slice(1).replace(/\//g, '.')] = e.message;
    return h;
  }, {})
  // return errors.map((e: ValueError) => ({
  //   path: e.path,
  //   value: e.value,
  //   message: e.message,
  // })
  // )
}