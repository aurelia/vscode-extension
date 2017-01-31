export class Value {
  constructor(public documentation: string = '') {
    
  }
}

export class Attribute {
  constructor(public documentation: string, public values: Map<string, Value> = new Map()) {    
  }
}
