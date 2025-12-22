// import { Type } from "@sinclair/typebox";
// import Ajv from 'ajv';
// import addFormats from 'ajv-formats';

// const ajv = new Ajv({ coerceTypes: true, allErrors: true });
// addFormats(ajv);

function escapePropName(propName: string) {
  const strPropName = JSON.stringify(propName);
  if (/^[a-z_$][a-z0-9_$]+$/i.test(propName)) return `.${propName}`;
  try {
    return new Function(`try { return '.' + ({ ${strPropName}: ${strPropName} }).${propName} } catch(e) { return '[${strPropName}]' }`)();
  } catch (e) {
    return `[${strPropName}]`;
  }
}

function escapePathName(pathName: string) {
  return JSON.stringify(pathName).slice(1, -1);
}

export interface TSchemaValidations {
  [key: string]: any | TSchemaValidations;
}

// No way to define _aliases, _const and prepend correctly...
export type TypeValidations = {
  [key in string]: ValidateCodeFunc
  // | Record<string, string>
  // | ((varName: string, addDependencies: (dependencies: Record<string, any>) => Record<string, any>) => void | string)
  // | ((current: Record<string, any>) => Record<string, any>)
  // | TypeValidations
  | Record<string, ValidateCodeFunc | any>
};
type TypeValidationTransform = ((current: Record<string, string>) => Record<string, string>);

// interface TypeValidationWithOptionalProps {
//   _aliases: Record<string, string> | TypeValidationTransform;
//   _const: Record<string, any> | TypeValidationTransform;
//   _prepend: (varName: string, addDependencies: (dependencies: Record<string, any>) => Record<string, any>) => void | string
// }
// export type TypeValidations = TypeValidationsBase & Partial<TypeValidationWithOptionalProps>;

type VarNameGenerator = ReturnType<typeof getUVN>;
type ValidateCodeFunc = (varName: string, value?: any) => string;
type DeserializeCodeFunc = (varName: string, vn: VarNameGenerator) => string;
type SerializeFunc = (value: any) => string;

interface Shared {
  vn: VarNameGenerator;
  depth: number;
  storeErrors: boolean;
  dependencies: Record<string, any>;
  varNameParam: boolean;
};

export interface SchemaType {
  type: string;
  _type: any;
  value?: any;
  options?: TSchemaValidations;
  deserialize?: boolean;
}

export interface SchemaTypeRegistry {
  Union: <T extends SchemaType[]>(...args: T) => { type: "Union"; _type: T[number]["_type"]; value: T };
  Array: <T extends SchemaType>(arr: T, options?: TSchemaValidations) => { type: "Array"; _type: T["_type"][]; options?: TSchemaValidations; value: T };
  Object: <T extends Record<string, SchemaType>>(o: T, options?: TSchemaValidations) => { type: "Object"; _type: { [K in keyof T]: T[K]["_type"] }; options?: TSchemaValidations; value: T; };
  Undefined: (options?: TSchemaValidations) => { type: "Undefined"; _type: undefined; options?: TSchemaValidations };
  Null: (options?: TSchemaValidations) => { type: "Null"; _type: null; options?: TSchemaValidations };
  Boolean: (options?: TSchemaValidations) => { type: "Boolean"; _type: boolean; options?: TSchemaValidations };
  String: (options?: TSchemaValidations) => { type: "String"; _type: string; options?: TSchemaValidations };
  Number: (options?: TSchemaValidations) => { type: "Number"; _type: number; options?: TSchemaValidations };
  BigInt: (options?: TSchemaValidations) => { type: "BigInt"; _type: bigint; options?: TSchemaValidations };
  RegExp: (options?: TSchemaValidations) => { type: "RegExp"; _type: RegExp; options?: TSchemaValidations };
}

type SchemaTypes = ReturnType<SchemaTypeRegistry[keyof SchemaTypeRegistry]>;

export namespace Schema {
  export type infer<T extends SchemaType> = T["_type"];
}

export type TSchema = {
  [K in keyof SchemaTypeRegistry]: SchemaTypeRegistry[K];
} & {
  [K in keyof SchemaTypeRegistry as `to${K}`]: SchemaTypeRegistry[K];
};

const BaseSchema = {
  // utils
  serialize: (v: any): string => v,

  // Array: (arr: _SchemaType, options?: TSchemaValidations) => ({ type: 'Array', value: arr as SchemaType, options }),
  // Object: (o: Record<string, _SchemaType>, options?: TSchemaValidations) => ({ type: 'Object', value: o as Record<string, SchemaType>, options }),
  // Union: (...args: _SchemaType[]) => ({ type: "Union", value: args as SchemaType[] }),

  isNullishOperatorSupported: (() => {
    try {
      new Function("let a; a ??= 1")();
      return true
    } catch (e) {
      return false
    }
  })(),

  _addToType: (type: string) => {
    (Schema as any)['to' + type] = (...args: any[]) => ({ ...(Schema as any)[type](...args), deserialize: true });
  },
  addType: (type: string, validateCode: ValidateCodeFunc, deserializeCode: DeserializeCodeFunc, serialize: null | SerializeFunc = null) => {
    if (type.charAt(0) !== type.charAt(0).toUpperCase()) {
      throw new Error(`Type name must start with an uppercase letter -- try ${type.charAt(0).toUpperCase() + type.slice(1)} instead of ${type}`);
    }

    SchemaValidateCode[type] = { type: validateCode };
    SchemaDeSerializeCode[type] = deserializeCode;
    if (serialize) SchemaSerialize[type] = serialize;

    (Schema as any)[type] = (options: TSchemaValidations) => ({ type, _type: undefined, options });
    Schema._addToType(type);

    // Regenerate serialize method
    if (serialize) {
      Schema.serialize = (() => {
        let code = Object.keys(SchemaSerialize).map((type) => {
          if (typeof SchemaSerialize[type] !== "function") return '';
          return `if (${SchemaValidateCode[type].type('v')}) return \`${SchemaSerialize[type](`\${v}`)}\``;
        }).join('; ');
        return new Function("v", `${code}; return JSON.stringify(v)`) as (v: any) => string;
      })();
    }
  },

  addTypeValidations: (type: string, validations: TypeValidations) => {
    if (!(type in Schema)) throw new Error(`addTypeValidations: Schema.${type} doesn't exists`);

    const mergeValidations = (validations: TypeValidations, validateCode: TypeValidations, key: string, depth = 0) => {
      Object.keys(validations).forEach(validationName => {
        if (depth === 0) {
          if (validationName === "type") {
            throw new Error(`⚠️ Warning: You are attempting to override ${type}.type. This may alter how ${type} instances are validated.
If this is the intended behavior, please use the '_type' property instead.`);
          }
          if (validationName === "_type") validationName = "type";
        }

        const originalValidation = validations[validationName];
        if (validationName.startsWith('_')) {
          if (('_aliases' === validationName || validationName.endsWith('Map')) && typeof originalValidation === 'function') {
            const newValue = (originalValidation as unknown as TypeValidationTransform)((validateCode[validationName] || {}) as Record<string, any>);
            if (Object.prototype.toString.call(newValue) !== '[object Object]') {
              throw new Error(`addTypeValidations: ${validationName} function must return an object`);
            }
            validateCode[validationName] = newValue as any;
          } else {
            validateCode[validationName] = originalValidation;
          }
          return;
        }

        if (Object.prototype.toString.call(originalValidation) === '[object Object]') {
          if (!(validationName in validateCode)) validateCode[validationName] = {};
          mergeValidations(originalValidation as TypeValidations, validateCode[validationName] as TypeValidations, `${key}.${validationName}`, depth + 1);
        } else if (typeof originalValidation === 'function') {
          validateCode[validationName] = (varName: string, value: any) => (originalValidation as ValidateCodeFunc)(varName, Schema.serialize(value));
        }
      });
      // Check alias errors
      const aliasErrors: string[] = [];
      const validationNames = Object.keys(validateCode).filter(k => !k.startsWith('_'));
      (Object.values(validateCode._aliases || {}) as string[]).forEach((alias) => {
        if (!validationNames.includes(alias)) aliasErrors.push(`${key}.${alias}`);
      });
      if (aliasErrors.length > 0) {
        const message = aliasErrors.length === 1
          ? `This alias is not associated with any validation: ${aliasErrors[0]}`
          : `These aliases are not associated with any validation: ${aliasErrors.join(', ')}`;
        console.warn(message);
      }

      return validations;
    };

    mergeValidations(validations, SchemaValidateCode[type], type);
  },

  compile: (schema: SchemaType, options?: { varName?: string; varNameParam?: boolean; errors?: boolean; }) => {
    const { varName = '', varNameParam = false, errors: storeErrors = true } = options || {};

    const vn = getUVN();
    vn('value', true)
    vn('errors', true);
    vn('valid', true);
    vn('__unusedException', true);
    vn('varNameOverride', true);

    let treeNode = new Node(schema, varNameParam ? '' : varName, vn('value'), {
      vn,
      depth: 0,
      storeErrors,
      dependencies: [],
      varNameParam
    });
    let deserialized = storeErrors ? '' : treeNode.toDeserializeCode();
    let validate = treeNode.toValidateCode();
    const dependencies = treeNode.shared.dependencies;

    // console.log((varNameParam ? `${vn('varNameOverride')} = ${vn('varNameOverride')} != null ? ${vn('varNameOverride')} : "${varName}";` : '') +
    //   (deserialized ? `${deserialized};` : '') + (storeErrors
    //     ? (`const ${vn('errors')} = {}; let ${vn('valid')} = true; ${validate} ; return { errors: ${vn('errors')}, valid: ${vn('valid')}, value: ${vn('value')} }`)
    //     : `; return { valid: ${validate}, value: ${vn('value')} }`))

    const func = new Function(...Object.keys(dependencies), vn('value'), vn('varNameOverride'),
      (varNameParam ? `${vn('varNameOverride')} = ${vn('varNameOverride')} != null ? ${vn('varNameOverride')} : "${varName}";` : '') +
      (deserialized ? `${deserialized};` : '') + (storeErrors
        ? (`const ${vn('errors')} = {}; let ${vn('valid')} = true; ${validate} ; return { errors: ${vn('errors')}, valid: ${vn('valid')}, value: ${vn('value')} }`)
        : `; return { valid: ${validate}, value: ${vn('value')} }`)
    );
    const dependenciesValues = Object.values(dependencies);
    return dependenciesValues.length ? func.bind(null, ...Object.values(dependencies)) : func;
  },
};
export const Schema = {
  ...BaseSchema,
  // Special cases
  Array: (arr, options) => ({ type: 'Array', _type: undefined as any, value: arr as SchemaTypes, options }),
  Object: (o, options) => ({ type: 'Object', _type: undefined as any, value: o as Record<string, SchemaTypes>, options }),
  Union: (...args) => ({ type: "Union", _type: undefined as any, value: args as SchemaTypes[] }),
} as typeof BaseSchema & TSchema;


const SchemaValidateCode: Record<string, Record<'type' | string, ValidateCodeFunc>> = {
  Object: { type: (varName) => `Object.prototype.toString.call(${varName}) === '[object Object]'` },
  Array: { type: (varName) => `Array.isArray(${varName})` }
};
const SchemaDeSerializeCode: Record<string, DeserializeCodeFunc> = {
  Object: (varName, vn) => `if (typeof ${varName} === 'string') { try { ${varName} = JSON.parse(${varName}) } catch(${vn('__unusedException')}) {} } else { ${varName} = Object(${varName}) }`,
  Array: (varName, vn) => `try { if (typeof ${varName} === 'string' && (${varName} = ${varName}.trim()).startsWith('[') && ${varName}.endsWith(']')) { ${varName} = JSON.parse(${varName}) } else { ${varName} = Array.from(${varName}) } } catch(${vn('__unusedException')}) {}`
};
const SchemaSerialize: Record<string, SerializeFunc> = {};


Schema._addToType('Object');
Schema._addToType('Array');
Schema.addType('Undefined',
  (varName) => `typeof ${varName} === 'undefined'`,
  (varName) => `${varName} = ${varName} === 'undefined' ? void(0) : ${varName}`,
);
Schema.addType('Null',
  (varName) => `${varName} === null`,
  (varName) => `${varName} = ${varName} === 'null' ? null : ${varName}`,
);
Schema.addType('Boolean',
  (varName) => `typeof ${varName} === 'boolean'`,
  (varName) => `${varName} = ${varName} === 'false' ? false : Boolean(${varName})`,
);
Schema.addType('String',
  (varName) => `typeof ${varName} === 'string'`,
  (varName) => `${varName} = String(${varName})`,
);
Schema.addType('Number',
  (varName) => `Number.isFinite(${varName})`,
  (varName) => `${varName} = Number(${varName})`,
);
Schema.addType('BigInt',
  (varName) => `typeof ${varName} === 'bigint'`,
  (varName, vn) => `try { ${varName} = BigInt(typeof ${varName} === 'string' ? ${varName}.replace(/n$/, '') : ${varName}) } catch(${vn('__unusedException')}) {}`,
  (value: BigInt) => `${value}n`
);
Schema.addType('RegExp',
  (varName) => `Object.prototype.toString.call(${varName}) === '[object RegExp]'`,
  (varName, vn) => `try { ${varName} = typeof ${varName} === 'string' ? new RegExp(${varName}.replace(/^\\/(.*?)\\/$/g, '$1')) : ${varName} } catch(${vn('__unusedException')}) {}`,
  (value: RegExp) => `${value}`
);


Schema.addTypeValidations('String', {
  length: {
    _aliases: { ">=": "min", "<=": "max" },
    // _prepend: (varName, addDependencies) => {
    //   addDependencies({});
    //   return `console.log("==> " + '...');`
    // },
    is: (varName: string, value: number) => `${varName}.length === ${value}`,
    min: (varName: string, value: number) => `${varName}.length >= ${value}`,
    max: (varName: string, value: number) => `${varName}.length <= ${value}`,
  },
  format: (varName: string, value: RegExp) => `${value}.test(${varName})`
});

Schema.addTypeValidations('String', {
  length: {
    _aliases: (current: Record<string, any>) => ({ ...current, "is": "min" }),
  },
  _formatMap: {
    // v1 to v5, including nil uuid:
    // https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
    "uuid": /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    // specific versions:
    "uuid-v1": /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    "uuid-v2": /^[0-9A-F]{8}-[0-9A-F]{4}-[2][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    "uuid-v3": /^[0-9A-F]{8}-[0-9A-F]{4}-[3][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    "uuid-v4": /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    "uuid-v5": /^[0-9A-F]{8}-[0-9A-F]{4}-[5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  }
});

// Schema.addTypeValidations('String', {
//   _formatMap: (current: Record<string, any>) => ({
//     ...current,
//     foo: /^[a-z]+$/
//   })
// });




const numericalitySigns: Record<string, string> = {
  greaterThan: ">",
  greaterThanOrEqualTo: ">=",
  equalTo: "===",
  otherThan: "!==",
  lessThan: "<",
  lessThanOrEqualTo: "<="
};
const numericValidations = Object.keys(numericalitySigns).reduce((validations: TSchemaValidations, validationName) => {
  const tsSign = numericalitySigns[validationName];
  validations[validationName] = (varName: string, value: number) => `${varName} ${tsSign} ${value}`;
  return validations;
}, {
  _aliases: {
    ">": "greaterThan",
    ">=": "greaterThanOrEqualTo",
    "==": "equalTo",
    "!=": "otherThan",
    "<": "lessThan",
    "<=": "lessThanOrEqualTo"
  }
});
Schema.addTypeValidations("Number", numericValidations);
Schema.addTypeValidations("BigInt", numericValidations);

// Schema.addTypeValidations('Number', {
//   int: 
// });

class Node {
  schema: SchemaType;
  type: SchemaType['type'];
  options: SchemaType['options'];
  deserializeCode: null | DeserializeCodeFunc;
  validateCode: Record<string, ValidateCodeFunc>;
  validate: undefined | ValidateCodeFunc;
  path: string;
  varName: string;
  shared: Shared;
  vn: Shared['vn'];
  children?: Node[];
  iterable?: { node: Node, iterVar: string, indexVar: string };
  union?: Node[];

  constructor(schema: SchemaType, path: string, varName: string, shared: Shared) {
    ++shared.depth;

    this.schema = schema;
    this.type = schema.type;
    this.options = schema.options;
    this.deserializeCode = schema.deserialize ? SchemaDeSerializeCode[this.type] : null;
    this.validateCode = SchemaValidateCode[this.type];
    this.validate = this.validateCode?.type

    this.path = path;
    this.varName = varName;
    this.shared = shared;
    this.vn = shared.vn;


    if (this.type === "Union") {
      this.union = schema.value.map((us: SchemaTypes) => new Node(us, path, varName, shared));
    }
    if (this.type === 'Object') {
      this.children = Object.keys(schema.value).map(propName => {
        return new Node(
          schema.value[propName],
          [path, escapePathName(propName)].filter(Boolean).join('.'),
          `${varName}${escapePropName(propName)}`,
          shared
        );
      });
    }
    if (this.type === "Array") {
      const indexVar = shared.vn('__index' + shared.depth, true)
      this.iterable = {
        node: new Node(schema.value, `${path}["+${indexVar}+"]`, `${varName}[${indexVar}]`, shared),
        iterVar: shared.vn('__varName' + shared.depth, true),
        indexVar: indexVar
      };
    }
  }

  get hasContent() {
    return this.options || this.children || this.iterable;
  }

  toDeserializeCode() {
    if (this.union) {
      return `[${this.union.filter(u => u.deserializeCode).map((u: Node): string => {
        return `() => { ${u.toDeserializeCode()}; return ${u.validate!(u.varName)} }`
      }).join(', ')}].some(f => f())`;
    }

    let code = this.deserializeCode ? [this.deserializeCode(this.varName, this.vn)] : [];
    if (!this.shared.storeErrors) {
      if (this.children) this.children.forEach(o => code.push(o.toDeserializeCode()));
      if (this.iterable) {
        const iterableCode = this.iterable.node.toDeserializeCode();
        if (iterableCode) code.push(`${this.varName}.forEach((${this.iterable.iterVar}, ${this.iterable.indexVar}) => { ${iterableCode} })`);
      }
    }
    return code.join('; ');
  }

  addErrorCode(error: string) {
    const vno = this.vn('varNameOverride');
    const key = this.shared.varNameParam
      ? (this.path ? `${vno} ? ${vno} + ".${this.path}" : "${this.path}"` : vno)
      : `"${this.path}"`;
    return `if (${this.vn('valid')}) ${this.vn('valid')} = false; ` + (Schema.isNullishOperatorSupported
      ? `(${this.vn('errors')}[${key}] ??= []).push(${error})`
      : `(${this.vn('errors')}[${key}] = ${this.vn('errors')}[${key}] || []).push(${error})`);
  }

  toValidateUnionCode(): string {
    if (!this.union) return '';

    if (this.shared.storeErrors) {
      // TODO: Can't we optimize [{ or: [{}, {}] }] ?
      const deserializeCode = this.toDeserializeCode();
      const ifCode = this.union.map(u => `(${u.validate!(u.varName)})`).join(' || ');
      const errorObjCode = this.union.map(u => `{ key: "${u.type}.type" }`);
      let code = `if (!(${deserializeCode ? `${deserializeCode} || ` : ''}${ifCode})) { ${this.addErrorCode(`{ or: [${errorObjCode}] }`)} }`;

      let unionContents = this.union.filter(u => u.hasContent);
      if (!unionContents.length) return code;

      let codeContents = unionContents.map(u => `if (${u.validate!(u.varName)}) { ${u.toValidateCodeContent()} }`);
      return `${code} else { ${codeContents.join(' ')} }`;
    }
    return `(${this.union.map(u => `(${u.toValidateCode()})`).join(' || ')})`;
  }

  toValidateCodeOptions(options: TSchemaValidations, validateCode: TypeValidations, key: string) {
    let code: string[] = [];
    const aliases = (validateCode._aliases || {}) as Record<string, string>;
    // Iterate through all validation options
    Object.keys(options).filter(k => !k.startsWith('_')).forEach((optionName) => {
      //!\ get value before managing aliases /!\
      const originalValue = options[optionName];

      // Alias
      optionName = aliases[optionName] || optionName;
      let currentKey = `${key}.${escapePathName(optionName)}`;
      if (!(optionName in validateCode)) throw new Error(`Validation ${currentKey} does not exist`);

      const validate = validateCode[optionName];
      // Recursive
      if (Object.prototype.toString.call(originalValue) === '[object Object]') {
        code.push(this.toValidateCodeOptions(originalValue, validate as TypeValidations, currentKey));
        return;
      }

      const constants = (validateCode[`_${optionName}Map`] || {}) as Record<string, string>;
      let value = originalValue;
      if (originalValue in constants) {
        value = constants[originalValue];
        currentKey += `.${escapePathName(originalValue)}`;
      }
      // Validation
      const ifCode = (validate as ValidateCodeFunc)(this.varName, value);
      if (this.shared.storeErrors) {
        const errorObjCode = `{ key: "${currentKey}", "value": ${Schema.serialize(value)} }`;
        code.push(`if (!(${ifCode})) { ${this.addErrorCode(errorObjCode)} }`);
      } else {
        code.push(ifCode);
      }
    });
    let strCode = code.join(this.shared.storeErrors ? ' ' : ' && ');

    // Prepend
    if (strCode && '_prepend' in validateCode && typeof validateCode._prepend === 'function') {
      const localDependencies: Record<string, any> = {};
      const addDependencies = (dependencies: Record<string, any>) => Object.assign(localDependencies, dependencies);
      let prependCode = validateCode._prepend(this.varName, addDependencies);
      strCode = `${prependCode}; ${this.shared.storeErrors ? '' : 'return '}${strCode}`;
      const dependencyVarNames = Object.keys(localDependencies);
      const eos = this.shared.storeErrors ? ';' : ' ';
      if (!dependencyVarNames.length) return `(() => { ${strCode} })()${eos}`;
      const uniqueDepVarNames = dependencyVarNames.map(name => this.vn(`${key}.${name}`, true));
      strCode = `((${dependencyVarNames.join(',')}) => { ${strCode} })(${uniqueDepVarNames.join(',')})${eos}`;
      dependencyVarNames.forEach((name, index) => {
        this.shared.dependencies[uniqueDepVarNames[index]] = localDependencies[name];
      });
    }
    return strCode;
  }

  toValidateCodeContent(): string {
    if (this.shared.storeErrors) {
      let code = '';
      if (this.options) code += this.toValidateCodeOptions(this.options, this.validateCode, this.type);
      if (this.children) code += this.children.map(o => o.toValidateCode()).join(' ')
      if (this.iterable) code += `; for (let ${this.iterable.indexVar} = 0; ${this.iterable.indexVar} < ${this.varName}.length; ++${this.iterable.indexVar}) { ${this.iterable.node.toValidateCode()} }; `
      return code;
    }
    let code = [];
    if (this.options) code.push(this.toValidateCodeOptions(this.options, this.validateCode, this.type));
    if (this.children) this.children.forEach(o => code.push(o.toValidateCode()));
    if (this.iterable) code.push(`${this.varName}.every((${this.iterable.iterVar}, ${this.iterable.indexVar}) => ${this.iterable.node.toValidateCode()})`);
    return code.join(' && ');
  }

  toValidateCode() {
    if (this.union) return this.toValidateUnionCode();

    if (this.shared.storeErrors) {
      const ifCode = this.validate!(this.varName);
      const errorObjCode = `{ key: "${this.type}.type" }`;
      const code = `${this.toDeserializeCode()}; if (!(${ifCode})) { ${this.addErrorCode(errorObjCode)} } `;
      return this.hasContent ? `${code} else { ${this.toValidateCodeContent()} }` : code;
    }

    return [
      this.validate!(this.varName),
      this.toValidateCodeContent()
    ].filter(Boolean).join(' && ');
  }
}

class VariableNameGenerator {
  private index = 0;

  private toVariableName(index: number): string {
    let name = '';
    do {
      name = String.fromCharCode(97 + (index % 26)) + name;
      index = Math.floor(index / 26) - 1;
    } while (index >= 0);
    return name;
  }

  public next(): string {
    const name = this.toVariableName(this.index);
    this.index++;
    return name;
  }

  public reset(): void {
    this.index = 0;
  }
}

// Get unique var name
function getUVN() {
  const generator = new VariableNameGenerator();
  const cache: Record<string, string> = {};
  return function (name: string, isNew?: boolean) {
    if (isNew && (name in cache)) throw new Error("variable already defined: " + name + " . " + JSON.stringify(cache))
    if (!(name in cache)) cache[name] = generator.next();
    return cache[name];
  }
}

// console.log(JSON.stringify(Schema.Object({
//   str: Schema.String({ format: "uuid" })
// }), null, 2))

// const v = Schema.compile(
//   Schema.Object({
//     name: Schema.toString({ length: { "min": 10 }, format: 'foo' }),
//     // reg: Schema.toRegExp(),
//     // bigint: Schema.BigInt({ '==': 5n }),
//     // num: Schema.toArray(Schema.toNumber()),
//     // // bigint: Schema.Union(Schema.toBigInt({ '==': 5n }), Schema.toNull())
//   }),
//   // { varName: 'foo', varNameParam: true }
// );

// console.log(v.toString())

// console.log(v({
//   name: 'abcdefg0hijklm',
//   // reg: '[a-z]',
//   // num: [],
//   // bigint: 4
// }).errors);

// type Integer = infer T extends number? extends bigint ? T : never : never; // infer T ?`${T}` extends `${bigint}`: never;


// const schema = Schema.Object({
//   foo: Schema.Array(Schema.String()), bar: Schema.Object({
//     foobar: Schema.toNumber()
//   })
// });


// type MyType = Schema.infer<typeof schema>;

// const toto = (a: MyType) => null

// toto({
//   foo: ['1'],
//   bar: {
//     foobar: 5
//   }
// })

// console.log(v.toString())

// console.log(v({
//   name: '123456789',
//   num: [1, 'a'],
//   bigint: '5n'
// }));

// const ParamsSchema1 = Schema.toObject({
//   name: Schema.toString({ length: { "min": 10 }, format: /./ }),
//   num: Schema.toArray(Schema.toNumber()),
//   bigint: Schema.Union(Schema.toBoolean(), Schema.toNumber({ '==': 5 }))
// });

// const ParamsSchema2 = Type.Object({
//   name: Type.String({ minLength: 10, pattern: '.' }),
//   num: Type.Array(Type.Number()),
//   bigint: Type.Union([Type.Boolean(), Type.Number({ const: 5 })])
// });

// console.log(Schema.compile(ParamsSchema1).toString())
// console.log("********************")
// console.log(ajv.compile(ParamsSchema2).toString())


// console.time('t1')
// let v1 = Schema.compile(ParamsSchema1);
// for (let i = 0; i < 1000000; ++i) {
//   v1({
//     name: '1234567890',
//     num: [1, 'a'],
//     bigint: 5
//   })
// }
// console.timeEnd('t1')



// console.time('t2')
// let v2 = ajv.compile(ParamsSchema2);
// for (let i = 0; i < 1000000; ++i) {
//   v2({
//     name: '1234567890',
//     num: [1, 'a'],
//     bigint: 5
//   })
// }
// console.timeEnd('t2')