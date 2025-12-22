"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INDEX_TEMPLATE = void 0;
exports.INDEX_TEMPLATE = `#!{IMPORTS}

export default class #!{ENTITY_NAME} {
	static get all(): #!{ENTITY_NAME}[] {
		return [#!{CLASSES}]
	};

	#!{RE_EXPORT_CLASSES}
}`;
//# sourceMappingURL=index.template.js.map