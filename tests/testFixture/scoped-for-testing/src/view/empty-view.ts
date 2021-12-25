@customElement({ name: 'empty-view', template })
export class EmptyView {
  constructor(
    /** Private documentation */
    private pri: string,   // 1
    public pub: number,    // 2
    protected prot,        // 3
    normal,                // 4
    readonly readOnly      // 5
  ) {}
}
