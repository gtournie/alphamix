export const INDEX_TEMPLATE = `#!{IMPORTS}

export default class #!{ENTITY_NAME} {
	static get all(): #!{ENTITY_NAME}[] {
		return [#!{CLASSES}]
	};

	#!{RE_EXPORT_CLASSES}

	constructor(obj: unknown) {
    Object.assign(this, obj);
  }
}`