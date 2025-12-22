
function escapePropName(propName: string) {
  const strPropName = JSON.stringify(propName);
  try {
    return new Function(`try { return '.' + ({ ${strPropName}: ${strPropName} }).${propName} } catch(e) { return '[${strPropName}]' }`)();
  } catch (e) {
    return `[${strPropName}]`;
  }
}

// Special cases
const Schema = {
  Union: (...args) => ({ type: "Union", value: args }),
  Array: (arr: any[], options) => ({
    type: 'Array',
    value: arr,
    options,
    validateCode: {
      type: (varName: string) => `Array.isArray(${varName})`
    },
  }),
  Object: (o: Record<string, any>, options) => ({
    type: 'Object',
    value: o,
    options,
    validateCode: {
      type: (varName: string) => `Object.prototype.toString.call(${varName}) === '[object Object]'`
    },
  }),
  // TODO: rename coerce to fromString?
  addType: (type, validateCode, coerceCode, serialize = null) => {
    Schema[type] = (options) => ({
      type,
      options,
      validateCode: {
        type: validateCode
      },
      serialize
    });
    Schema['to' + type] = (...args) => ({ ...Schema[type](...args), coerceCode });

    // Regenerate serialize method
    Schema.serialize = (() => {
      let code = Object.keys(Schema).map((type) => {
        if (typeof type === "string" && (!type.startsWith('to') || typeof Schema[type] !== "function")) return '';
        const schema = Schema[type]();
        if (!schema.serialize) return '';
        return `if (${schema.validateCode.type('v')}) return \`${schema.serialize(`\${v}`)}\``;
      }).join(' ');
      return new Function("v", `${code}; return v`);
    })();
  },
  addTypeValidations: (type, validations) => {
    if (!(type in Schema)) throw new Error(`Schema.${type} doesn't exists`);

    const convertValidations = (validations) => {
      Object.keys(validations).filter(k => !k.startsWith('_')).forEach(validationName => {
        const originalValidation = validations[validationName];
        if (Object.prototype.toString.call(originalValidation) === '[object Object]') {
          convertValidations(originalValidation);
        } else {
          validations[validationName] = (varName: string, value: any) => originalValidation(varName, Schema.serialize(value));
        }
      });
      return validations;
    };

    const schemaType = Schema[type];
    Schema[type] = (...args) => {
      const schema = schemaType(...args);
      Object.assign(schema.validateCode, convertValidations(validations));
      return schema;
    };
  }
};
Schema.toObject = (...args) => ({
  ...Schema.Object(...args),
  coerceCode: (varName: string) => `${varName} = typeof ${varName} === 'string' ? JSON.parse(${varName}) : Object(${varName})`
});
Schema.toArray = (...args) => ({
  ...Schema.Array(...args),
  coerceCode: (varName: string) => `${varName} = typeof ${varName} === 'string' && ${varName}.startsWith('[') && ${varName}.endsWith(']') ? JSON.parse(${varName}) : Array.from(${varName})`
});

Schema.addType('Undefined',
  (varName: string) => `typeof ${varName} === 'undefined'`,
  (varName: string) => `${varName} = ${varName} === 'undefined' ? void(0) : ${varName}`,
);
Schema.addType('Null',
  (varName: string) => `${varName} === null`,
  (varName: string) => `${varName} = ${varName} === 'null' ? null : ${varName}`,
);
Schema.addType('Boolean',
  (varName: string) => `typeof ${varName} === 'boolean'`,
  (varName: string) => `${varName} = ${varName} === 'false' ? false : Boolean(${varName})`,
);
Schema.addType('String',
  (varName: string) => `typeof ${varName} === 'string'`,
  (varName: string) => `${varName} = String(${varName})`,
);
Schema.addType('Number',
  (varName: string) => `Number.isFinite(${varName})`,
  (varName: string) => `${varName} = Number(${varName})`,
);
Schema.addType('Bigint',
  (varName: string) => `typeof ${varName} === 'bigint'`,
  (varName: string) => `${varName} = typeof ${varName} === 'string' ? BigInt(${varName}.replace(/n$/, '')) : BigInt(${varName})`,
  (value: BigInt) => `${value}n`
);

// console.log(Schema.serialize(5))


Schema.addTypeValidations('String', {
  length: {
    _aliases: { ">=": "min" },
    // _prepend: (varName, addDependencies) => {
    //   addDependencies({ Type: Type });
    //   return `console.log("==> " + Object.keys(Type))`
    // },
    is: (varName: string, value: number) => `${varName}.length === ${value}`,
    min: (varName: string, value: number) => `${varName}.length >= ${value}`,
    max: (varName: string, value: number) => `${varName}.length <= ${value}`,
  },
  format: (varName: string, value: string | RegExp) => {
    if (typeof value === "string") value = new RegExp(value);
    return `${value}.test(${varName})`;
  }
});

const numericalitySigns = {
  greaterThan: ">",
  greaterThanOrEqualTo: ">=",
  equalTo: "===",
  otherThan: "!==",
  lessThan: "<",
  lessThanOrEqualTo: "<="
};
['Number', 'Bigint'].forEach((type) => {
  const numericValidations = Object.keys(numericalitySigns).reduce((validations, validationName) => {
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
  Schema.addTypeValidations(type, numericValidations);
})

function compile(schema, storeErrors, varName = 'value') {
  const vn = getUVN();
  vn('errors', true);

  let treeNode = buildNodeTree(schema, varName, vn(varName, true), {
    depth: 0,
    dependencies: [],
    vn
  });
  let coerce = treeNode.toCoerceCode();
  let validate = treeNode.toValidateCode(storeErrors);
  const dependencies = treeNode.shared.dependencies;

  console.log((coerce ? `try { ${coerce} } catch(e) {} ` : '') + (storeErrors
    ? `const ${vn('errors')} = {}; ${validate} ; return { errors: ${vn('errors')}, valid: !Object.keys(${vn('errors')}).length, value: ${vn(varName)} }`
    : `return { valid: ${validate}, value: ${vn(varName)} }`))

  const func = new Function(...Object.keys(dependencies), vn(varName),
    (coerce ? `try { ${coerce} } catch(e) {} ` : '') + (storeErrors
      ? `const ${vn('errors')} = {}; ${validate} ; return { errors: ${vn('errors')}, valid: !Object.keys(${vn('errors')}).length, value: ${vn(varName)} }`
      : `return { valid: ${validate}, value: ${vn(varName)} }`)
  );
  const dependenciesValues = Object.values(dependencies);
  return dependenciesValues.length ? func.bind(null, ...Object.values(dependencies)) : func;
}


function buildNodeTree(schema, path, varName, shared) {
  ++shared.depth;

  const node = new Node(schema, "type", path, varName, shared);
  if (schema.type === "Union") {
    node.union = schema.value.map(unionSchema => {
      return buildNodeTree(unionSchema, path, varName, shared);
    });
    return node;
  }
  if (schema.options) {
    node.options = Object.keys(schema.options).map(propName => {
      return new Node(schema, propName, path, varName, shared)
    });
  }
  if (schema.type === 'Object') {
    node.children = Object.keys(schema.value).map(propName => {
      return buildNodeTree(schema.value[propName], path + '.' + JSON.stringify(propName).slice(1, -1), `${varName}${escapePropName(propName)}`, shared);
    });
    return node;
  }
  if (schema.type === "Array") {
    const indexVar = shared.vn('__index' + shared.depth, true)
    node.iterable = {
      node: buildNodeTree(schema.value, path + '[" + ' + indexVar + ' + "]', `${varName}[${indexVar}]`, shared),
      iterVar: shared.vn('__varName' + shared.depth, true),
      indexVar: indexVar
    };
    return node;
  }
  return node;
}

class Node {
  constructor(schema, validType, path, varName, shared) {
    this.coerceCode = schema.coerceCode;
    this.type = schema.type;
    // Union doesn't have a validType !== 'type'
    this.validType = validType !== 'type' ? (schema.validateCode._aliases || {})[validType] || validType : validType;
    this.path = path;
    this.varName = varName;
    this.shared = shared;
    this.vn = shared.vn;
    this.validate = this.type === 'Union' ? null : schema.validateCode[this.validType];

    // Careful. Here we use original validType
    const options = schema.options;
    this.hasValue = options && validType in options;
    this.value = this.hasValue ? options[validType] : null;
  }

  get hasContent() {
    return this.options || this.children || this.iterable;
  }

  toCoerceCode() {
    if (this.type === 'Union') {
      let code = `if (!(${this.union.map(u => `(${u.validate(u.varName, u.value)})`).join(' || ')})) {`
      code += `[${this.union.filter(u => u.coerceCode).map(u => {
        return `() => { try { ${u.toCoerceCode()}; return true } catch(e) { return false; } }`
      }).join(', ')}].some(f => f())`;
      return code + `} `;
    }

    let code = this.coerceCode ? [this.coerceCode(this.varName)] : [];
    if (this.children) this.children.forEach(o => code.push(o.toCoerceCode()));
    if (this.iterable) code.push(`${this.varName}.forEach((${this.iterable.iterVar}, ${this.iterable.indexVar}) => { ${this.iterable.node.toCoerceCode()} })`);
    return code.join('; ');
  }

  toValidateCodeContent(storeErrors) {
    let code = '';
    if (this.options) code += this.options.map(o => o.toValidateCode(storeErrors)).join(' ')
    if (this.children) code += this.children.map(o => o.toValidateCode(storeErrors)).join(' ')
    if (this.iterable) code += `; ${this.varName}.forEach((${this.iterable.iterVar}, ${this.iterable.indexVar}) => { ${this.iterable.node.toValidateCode(storeErrors)} }); `
    return code;
  }

  addErrorCode(error) {
    return `(${this.vn('errors')}["${this.path}"] = ${this.vn('errors')}["${this.path}"] || []).push(${error})`;
  }

  toValidateSubType(storeErrors) {
    let code = '';
    Object.keys(this.value).forEach((subType) => {
      const validateSubType = (this.validate._aliases || {})[subType] || subType;
      const ifCode = this.validate[validateSubType](this.varName, this.value[subType]);
      if (storeErrors) {
        const value = Schema.serialize(this.value[subType]);
        const errorObjCode = `{ key: "${this.type}.${this.validType}.${validateSubType}", "value": ${value} }`;
        code += `if (!(${ifCode})) { ${this.addErrorCode(errorObjCode)} } `;
      } else {
        code += ifCode;
      }
    })
    // TODO: should also be present when not collecting errors
    if (code) {
      if ('_prepend' in this.validate) {
        const localDependencies = {};
        const addDependencies = (dependencies) => Object.assign(localDependencies, dependencies);
        let prependCode = this.validate._prepend(this.varName, addDependencies);
        code = `${prependCode}; ${storeErrors ? 'return ' : ''}${code}`
        const dependencyVarNames = Object.keys(localDependencies)
        if (!dependencyVarNames.length) return ` (() => { ${code} })() `;
        const uniqueDepVarNames = dependencyVarNames.map(name => this.vn(`${this.type}.${this.validType}.${name}`, true));
        code = `((${dependencyVarNames.join(',')}) => { ${code} })(${uniqueDepVarNames.join(',')}) `;
        dependencyVarNames.forEach((name, index) => {
          this.shared.dependencies[uniqueDepVarNames[index]] = localDependencies[name];
        });
        return code;
      }
    }
    return code;
  }

  toValidateUnionCode(storeErrors) {
    if (storeErrors) {
      // TODO: Can't we optimize [{ or: [{}, {}] }] ?
      const ifCode = this.union.map(u => `(${u.validate(u.varName, u.value)})`).join(' || ');
      const errorObjCode = this.union.map(u => `{ key: "${u.type}.${u.validType}"${u.hasValue ? `, "value": ${Schema.serialize(u.value)}` : ``} }`);
      let code = `if (!(${ifCode})) { ${this.addErrorCode(`{ or: [${errorObjCode}] }`)} }`;

      let unionContents = this.union.filter(u => u.hasContent);
      if (!unionContents.length) return code;

      let codeContents = unionContents.map(u => `if (${u.validate(u.varName, u.value)}) { ${u.toValidateCodeContent(storeErrors)} }`);
      return `${code} else { ${codeContents.join(' ')} }`
    }
    return `(${this.union.map(u => `(${u.toValidateCode()})`).join(' || ')})`;
  }

  toValidateCode(storeErrors) {
    if (this.union) return this.toValidateUnionCode(storeErrors);

    if (this.validType !== 'type' && Object.prototype.toString.call(this.value) === '[object Object]') {
      return this.toValidateSubType(storeErrors);
    }

    if (storeErrors) {
      const ifCode = this.validate(this.varName, this.value);
      const errorObjCode = `{ key: "${this.type}.${this.validType}"${this.hasValue ? `, "value": ${Schema.serialize(this.value)}` : ``} }`;
      const code = `if (!(${ifCode})) { ${this.addErrorCode(errorObjCode)} } `;
      return this.hasContent ? `${code} else { ${this.toValidateCodeContent(storeErrors)} }` : code;
    }
    let code = [this.validate(this.varName, this.value)];
    if (this.options) this.options.forEach(o => code.push(o.toValidateCode()));
    if (this.children) this.children.forEach(o => code.push(o.toValidateCode()));
    if (this.iterable) code.push(`${this.varName}.every((${this.iterable.iterVar}, ${this.iterable.indexVar}) => ${this.iterable.node.toValidateCode()})`);
    return code.join(' && ');
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
  const cache = {};
  return function (name, isNew) {
    if (isNew && name in cache) throw new Error("variable already defined: " + name)
    if (!(name in cache)) cache[name] = generator.next();
    return cache[name];
  }
}


function coerce(schema, varName = 'value') {
  return new Function(varName, `try { ${buildNodeTree(schema, varName).toCoerceCode()} } catch(e) {}` + '; return ' + varName);
}

const v = compile(Schema.toObject({
  name: Schema.toString({ length: { ">=": 15 } }),
  num: Schema.toArray(Schema.toNumber()),
  bigint: Schema.Union(Schema.toBigint({ '==': 5n }), Schema.toString())
}), true);

console.log(v.toString())

console.log(v({
  name: '1234567890',
  num: [],
  bigint: 4n
}).errors);

