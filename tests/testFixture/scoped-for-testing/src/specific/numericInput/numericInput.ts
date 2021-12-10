/**
 * From: https://github.com/PrimeDAO/prime-launch-dapp
 * https://github.com/PrimeDAO/prime-launch-dapp/blob/master/src/resources/elements/numericInput/numericInput.ts
 */

import { autoinject, bindingMode, computedFrom } from 'aurelia-framework';
import { bindable } from 'aurelia-typed-observable-plugin';
import { BigNumber } from 'ethers';
import { fromWei, toWei } from 'services/EthereumService';
import { NumberService } from 'services/NumberService';

@autoinject
export class NumericInput {
  @bindable.booleanAttr public decimal = true;
  @bindable public css?: string;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) public id?: string;
  /**
   * what to display when there is no value
   */
  @bindable.string public defaultText = '';
  /**
   * handle should return falsey to accept the key.  Only fired on key strokes that have
   * already passed the default character filter.
   */
  @bindable public handleChange: ({ keyCode: number }) => boolean;
  @bindable public autocomplete = 'off';
  @bindable.booleanAttr public disabled;
  /**
   * Assumed to be in Wei and will be converted to ETH for the user and back to Wei for parent component.
   * Else value us set to  whatever string the user types.
   * If nothing is entered, then value is set to `defaultText`.
   */
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public value:
    | number
    | BigNumber
    | string;
  /**
   * if true then value is converted from wei to eth for editing
   */
  @bindable.booleanAttr public notWei?: boolean = false;
  /**
   * if isWei, then the number of decimals involved in the conversion
   */
  @bindable.number public decimals?: number = 18;
  @bindable.booleanAttr public outputAsString?: boolean = false;
  @bindable.string public placeholder = '';

  private element: HTMLInputElement;

  private _innerValue: string;

  private ignoreValueChanged = false;

  @computedFrom('_innerValue')
  private get innerValue() {
    return this._innerValue;
  }

  private set innerValue(newValue: string) {}

  private decimalsChanged() {}

  private valueChanged(
    newValue: string | BigNumber | number,
    oldValue: string | BigNumber | number
  ) {}

  constructor(private numberService: NumberService) {}

  public attached(): void {}

  public detached(): void {}

  // http://stackoverflow.com/a/995193/725866
  private isNavigationOrSelectionKey(e): boolean {}

  // http://stackoverflow.com/a/995193/725866
  private keydown(e) {}
}
