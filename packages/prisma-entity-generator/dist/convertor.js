"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaConvertor = void 0;
const class_component_1 = require("./components/class.component");
const field_component_1 = require("./components/field.component");
const util_1 = require("./util");
const primitiveMapType = {
    Int: 'number',
    String: 'string',
    DateTime: 'Date',
    Boolean: 'boolean',
    Json: 'object',
    BigInt: 'BigInt',
    Float: 'number',
    Decimal: 'number',
    Bytes: 'Buffer',
};
class PrismaConvertor {
    constructor() {
        this.getPrimitiveMapTypeFromDMMF = (dmmfField) => {
            if (typeof dmmfField.type !== 'string') {
                return 'unknown';
            }
            return primitiveMapType[dmmfField.type];
        };
        this.getClass = (input) => {
            const options = Object.assign({
                extractRelationFields: null
            }, input);
            const { model, extractRelationFields = null, postfix, } = options;
            let className = model.name;
            if (postfix) {
                className += postfix;
            }
            const classComponent = new class_component_1.ClassComponent({ name: className });
            const relationTypes = (0, util_1.uniquify)(model.fields
                .filter((field) => field.relationName &&
                (this._config.separateRelationFields
                    ? true
                    : model.name !== field.type))
                .map((v) => v.type));
            const typesTypes = (0, util_1.uniquify)(model.fields
                .filter((field) => field.kind == 'object' &&
                model.name !== field.type &&
                !field.relationName)
                .map((v) => v.type));
            const enums = model.fields.filter((field) => field.kind === 'enum');
            classComponent.fields = model.fields
                .filter((field) => {
                if (extractRelationFields === true) {
                    return field.relationName;
                }
                if (extractRelationFields === false) {
                    return !field.relationName;
                }
                return true;
            })
                .map((field) => this.convertField(field));
            classComponent.relationTypes =
                extractRelationFields === false ? [] : relationTypes;
            classComponent.enumTypes =
                extractRelationFields === true
                    ? []
                    : enums.map((field) => field.type.toString());
            classComponent.types = typesTypes;
            return classComponent;
        };
        this.getClasses = () => {
            const models = this.dmmf.datamodel.models;
            if (this.config.separateRelationFields === true) {
                return [
                    ...models.map((model) => this.getClass({
                        model,
                        extractRelationFields: true,
                        postfix: 'Relations',
                        useGraphQL: this.config.useGraphQL,
                    })),
                    ...models.map((model) => this.getClass({
                        model,
                        extractRelationFields: false,
                        useGraphQL: this.config.useGraphQL,
                    })),
                    ...this.dmmf.datamodel.types.map((model) => this.getClass({
                        model,
                        extractRelationFields: true,
                        useGraphQL: this.config.useGraphQL,
                    })),
                ];
            }
            return [
                ...models.map((model) => this.getClass({ model, useGraphQL: this.config.useGraphQL })),
                ...this.dmmf.datamodel.types.map((model) => this.getClass({
                    model,
                    useGraphQL: this.config.useGraphQL,
                })),
            ];
        };
        this.convertField = (dmmfField) => {
            var _a;
            const field = new field_component_1.FieldComponent({
                name: dmmfField.name,
                useUndefinedDefault: this._config.useUndefinedDefault,
            });
            let type = this.getPrimitiveMapTypeFromDMMF(dmmfField);
            if (dmmfField.isRequired === false) {
                field.nullable = true;
            }
            if (this.config.useNonNullableAssertions) {
                field.nonNullableAssertion = true;
            }
            if (this.config.preserveDefaultNullable) {
                field.preserveDefaultNullable = true;
            }
            if (dmmfField.default) {
                if (typeof dmmfField.default !== 'object') {
                    field.default = (_a = dmmfField.default) === null || _a === void 0 ? void 0 : _a.toString();
                    if (dmmfField.kind === 'enum') {
                        field.default = `${dmmfField.type}.${dmmfField.default}`;
                    }
                    else if (dmmfField.type === 'BigInt') {
                        field.default = `BigInt(${field.default})`;
                    }
                    else if (dmmfField.type === 'String') {
                        field.default = `'${field.default}'`;
                    }
                }
                else if (Array.isArray(dmmfField.default)) {
                    if (dmmfField.type === 'String') {
                        field.default = `[${dmmfField.default
                            .map((d) => `'${d}'`)
                            .toString()}]`;
                    }
                    else {
                        field.default = `[${dmmfField.default.toString()}]`;
                    }
                }
            }
            if (type) {
                field.type = type;
            }
            else {
                field.type = dmmfField.type;
            }
            if (dmmfField.isList) {
                field.type = (0, util_1.arrayify)(field.type);
            }
            return field;
        };
    }
    get dmmf() {
        return this._dmmf;
    }
    set dmmf(value) {
        this._dmmf = value;
    }
    get config() {
        return this._config;
    }
    set config(value) {
        this._config = value;
    }
    static getInstance() {
        if (PrismaConvertor.instance) {
            return PrismaConvertor.instance;
        }
        PrismaConvertor.instance = new PrismaConvertor();
        return PrismaConvertor.instance;
    }
}
exports.PrismaConvertor = PrismaConvertor;
//# sourceMappingURL=convertor.js.map