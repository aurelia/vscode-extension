export interface ITagSet {
	[tag: string]: HTMLTagSpecification;
}
export interface IAttributeSet {
	[tag: string]: Array<HTMLAttributeSpecification>;
}
export interface IEventSet {
	[tag: string]: Array<HTMLAttributeSpecification>;
}
export class HTMLAttributeSpecification {
  constructor(public name: string, public dataBindings = [], public hasBody = true, public defaultAttribute = true) { }
}
export class HTMLTagSpecification {
	constructor(public label: string, public attributes: HTMLAttributeSpecification[] = []) { }
}
