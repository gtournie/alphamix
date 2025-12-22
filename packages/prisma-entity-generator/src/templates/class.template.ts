export const CLASS_TEMPLATE = `#!{IMPORTS}

export default class #!{NAME} extends #!{ENTITY_NAME} {
  #!{FIELDS}

  constructor(#!{name}: #!{NAME}) {
    super(#!{name});
  }
} 
#!{EXTRA}
`
