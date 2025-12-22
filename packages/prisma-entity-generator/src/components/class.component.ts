import { Echoable } from '../interfaces/echoable'
import { FieldComponent } from './field.component'
import { CLASS_TEMPLATE } from '../templates/class.template'
import { BaseComponent } from './base.component'

export class ClassComponent extends BaseComponent implements Echoable {
	name: string
	fields?: FieldComponent[]
	relationTypes?: string[]
	enumTypes?: string[] = []
	extra?: string = ''
	types?: string[]

	echo() {
		const fieldContent = this.fields.map((_field) => _field.echo())
		let str = CLASS_TEMPLATE
			.replace('#!{ENTITY_NAME}', 'Entity') // TODO: put in config
			.replace('#!{NAME}', `${this.name}`)
			.replace('#!{FIELDS}', fieldContent.join('\r\n'))
			.replace('#!{EXTRA}', this.extra)

		return str
	}

	reExportPrefixed(prefix: string) {
		return `static get ${this.name}() { return ${this.name}; }`
	}
}
