export declare const INDEX_TEMPLATE = "#!{IMPORTS}\n\nexport default class #!{ENTITY_NAME} {\n\tstatic get all(): #!{ENTITY_NAME}[] {\n\t\treturn [#!{CLASSES}]\n\t};\n\n\t#!{RE_EXPORT_CLASSES}\n}";
