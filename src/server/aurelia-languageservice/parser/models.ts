export interface ITagSet {
	[tag: string]: HTMLTagSpecification;
}
export interface IAttributeSet {
	[tag: string]: Array<HTMLAttributeSpecification>;
}
export interface IEventSet {
	[tag: string]: Array<AureliaEventSpecification>;
}
export class HTMLAttributeSpecification {
  constructor(public name: string, public dataBindings = [], public hasBody = true, public defaultAttribute = true) { }
}
export class AureliaEventSpecification {
  constructor(public name: string) { }
}
export class HTMLTagSpecification {
	constructor(public label: string, public attributes: HTMLAttributeSpecification[] = []) { }
}
