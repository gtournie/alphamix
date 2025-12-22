import { DMMF } from '@prisma/generator-helper'
import { ClassComponent } from './components/class.component'
import { FieldComponent } from './components/field.component'
import { PrismaEntityGeneratorConfig } from './generator'
import { arrayify, uniquify } from './util'

/** BigInt, Boolean, Bytes, DateTime, Decimal, Float, Int, JSON, String, $ModelName */
type DefaultPrismaFieldType =
	| 'BigInt'
	| 'Boolean'
	| 'Bytes'
	| 'DateTime'
	| 'Decimal'
	| 'Float'
	| 'Int'
	| 'Json'
	| 'String'

const primitiveMapType: Record<DefaultPrismaFieldType, string> = {
	Int: 'number',
	String: 'string',
	DateTime: 'Date',
	Boolean: 'boolean',
	Json: 'object',
	BigInt: 'BigInt',
	Float: 'number',
	Decimal: 'number',
	Bytes: 'Buffer',
} as const

export type PrimitiveMapTypeKeys = keyof typeof primitiveMapType
export type PrimitiveMapTypeValues =
	typeof primitiveMapType[PrimitiveMapTypeKeys]

export interface SwaggerDecoratorParams {
	isArray?: boolean
	type?: string
	enum?: string
	enumName?: string
}

export interface ConvertModelInput {
	model: DMMF.Model
	extractRelationFields?: boolean
	postfix?: string
	useGraphQL?: boolean
}

export class PrismaConvertor {
	static instance: PrismaConvertor
	private _config: PrismaEntityGeneratorConfig
	private _dmmf: DMMF.Document

	public get dmmf() {
		return this._dmmf
	}

	public set dmmf(value) {
		this._dmmf = value
	}

	public get config() {
		return this._config
	}

	public set config(value) {
		this._config = value
	}

	static getInstance() {
		if (PrismaConvertor.instance) {
			return PrismaConvertor.instance
		}
		PrismaConvertor.instance = new PrismaConvertor()
		return PrismaConvertor.instance
	}

	getPrimitiveMapTypeFromDMMF = (
		dmmfField: DMMF.Field,
	): PrimitiveMapTypeValues => {
		if (typeof dmmfField.type !== 'string') {
			return 'unknown'
		}
		return primitiveMapType[dmmfField.type]
	}

	getClass = (input: ConvertModelInput): ClassComponent => {
		/** options */
		const options = Object.assign(
			{
				extractRelationFields: null
			},
			input,
		)
		const {
			model,
			extractRelationFields = null,
			postfix,
		} = options

		/** set class name */
		let className = model.name
		if (postfix) {
			className += postfix
		}
		const classComponent = new ClassComponent({ name: className })

		/** relation & enums */
		const relationTypes = uniquify(
			model.fields
				.filter(
					(field) =>
						field.relationName &&
						(this._config.separateRelationFields
							? true
							: model.name !== field.type),
				)
				.map((v) => v.type),
		)

		const typesTypes = uniquify(
			model.fields
				.filter(
					(field) =>
						field.kind == 'object' &&
						model.name !== field.type &&
						!field.relationName,
				)
				.map((v) => v.type),
		)

		const enums = model.fields.filter((field) => field.kind === 'enum')

		classComponent.fields = model.fields
			.filter((field) => {
				if (extractRelationFields === true) {
					return field.relationName
				}
				if (extractRelationFields === false) {
					return !field.relationName
				}
				return true
			})
			.map((field) => this.convertField(field))
		classComponent.relationTypes =
			extractRelationFields === false ? [] : relationTypes

		classComponent.enumTypes =
			extractRelationFields === true
				? []
				: enums.map((field) => field.type.toString())

		classComponent.types = typesTypes

		return classComponent
	}

	/**
	 * one prisma model could generate multiple classes!
	 *
	 * CASE 1: if you want separate model to normal class and relation class
	 */
	getClasses = (): ClassComponent[] => {
		const models = this.dmmf.datamodel.models

		/** separateRelationFields */
		if (this.config.separateRelationFields === true) {
			return [
				...models.map((model) =>
					this.getClass({
						model,
						extractRelationFields: true,
						postfix: 'Relations',
						useGraphQL: this.config.useGraphQL,
					}),
				),
				...models.map((model) =>
					this.getClass({
						model,
						extractRelationFields: false,
						useGraphQL: this.config.useGraphQL,
					}),
				),
				// mongodb Types support
				...this.dmmf.datamodel.types.map((model) =>
					this.getClass({
						model,
						extractRelationFields: true,
						useGraphQL: this.config.useGraphQL,
					}),
				),
			]
		}

		return [
			...models.map((model) =>
				this.getClass({ model, useGraphQL: this.config.useGraphQL }),
			),
			// mongodb Types support
			...this.dmmf.datamodel.types.map((model) =>
				this.getClass({
					model,
					useGraphQL: this.config.useGraphQL,
				}),
			),
		]
	}

	convertField = (dmmfField: DMMF.Field): FieldComponent => {
		const field = new FieldComponent({
			name: dmmfField.name,
			useUndefinedDefault: this._config.useUndefinedDefault,
		})
		let type = this.getPrimitiveMapTypeFromDMMF(dmmfField)

		if (dmmfField.isRequired === false) {
			field.nullable = true
		}

		if (this.config.useNonNullableAssertions) {
			field.nonNullableAssertion = true
		}

		if (this.config.preserveDefaultNullable) {
			field.preserveDefaultNullable = true
		}

		if (dmmfField.default) {
			if (typeof dmmfField.default !== 'object') {
				field.default = dmmfField.default?.toString()
				if (dmmfField.kind === 'enum') {
					field.default = `${dmmfField.type}.${dmmfField.default}`
				} else if (dmmfField.type === 'BigInt') {
					field.default = `BigInt(${field.default})`
				} else if (dmmfField.type === 'String') {
					field.default = `'${field.default}'`
				}
			} else if (Array.isArray(dmmfField.default)) {
				if (dmmfField.type === 'String') {
					field.default = `[${dmmfField.default
						.map((d) => `'${d}'`)
						.toString()}]`
				} else {
					field.default = `[${dmmfField.default.toString()}]`
				}
			}
		}

		if (type) {
			field.type = type
		} else {
			field.type = dmmfField.type
		}

		if (dmmfField.isList) {
			field.type = arrayify(field.type)
		}

		return field
	}
}
