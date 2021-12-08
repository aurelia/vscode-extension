/**
 * From: https://github.com/PrimeDAO/prime-launch-dapp
 * https://github.com/PrimeDAO/prime-launch-dapp/blob/master/src/resources/elements/numericInput/numericInput.ts
 */

import { LaunchService } from 'services/LaunchService';
import { WhiteListService } from 'services/WhiteListService';
import { autoinject, singleton, computedFrom } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DateService } from 'services/DateService';
import { BaseStage } from 'newLaunch/baseStage';
import Litepicker from 'litepicker';
import { Utils } from 'services/utils';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NumberService } from 'services/NumberService';
import { DisclaimerService } from 'services/DisclaimerService';
import { BigNumber } from 'ethers';
import { Address, EthereumService, fromWei } from 'services/EthereumService';
import { ITokenInfo, TokenService } from 'services/TokenService';
import { TokenListService } from 'services/TokenListService';
import { ISeedConfig } from 'newLaunch/seed/config';

@singleton(false)
@autoinject
export class Stage4 extends BaseStage<ISeedConfig> {
  launchConfig: ISeedConfig;
  startDateRef: HTMLElement | HTMLInputElement;
  endDateRef: HTMLElement | HTMLInputElement;
  startDate: Date;
  startTime = '00:00';
  endDate: Date;
  endTime = '00:00';
  dateService = new DateService();
  startDatePicker: Litepicker;
  endDatePicker: Litepicker;
  lastCheckedFundingAddress: string;
  fundingSymbol: string;
  fundingIcon: string;
  whitelist: Set<Address>;
  loadingWhitelist = false;
  lastWhitelistUrlValidated: string;
  tokenList: Array<ITokenInfo>;

  constructor(
    eventAggregator: EventAggregator,
    private numberService: NumberService,
    ethereumService: EthereumService,
    router: Router,
    tokenService: TokenService,
    private tokenListService: TokenListService,
    private whiteListService: WhiteListService,
    private disclaimerService: DisclaimerService,
    private launchService: LaunchService
  ) {
    super(router, ethereumService, eventAggregator, tokenService);
    this.eventAggregator.subscribe('launch.clearState', () => {
      this.startDate = undefined;
      this.endDate = undefined;
      this.startTime = undefined;
      this.endTime = undefined;
    });
  }

  async attached(): Promise<void> {}

  @computedFrom('launchConfig.launchDetails.whitelist')
  get whitelistUrlIsValid(): boolean {}

  @computedFrom(
    'launchConfig.launchDetails.whitelist',
    'lastWhitelistUrlValidated'
  )
  get currentWhitelistIsValidated(): boolean {}

  tokenChanged(): void {}

  toggleGeoBlocking(): void {}

  setlaunchConfigStartDate(): Date {}

  setlaunchConfigEndDate(): Date {}

  persistData(): void {}

  async validateInputs(): Promise<string> {}

  connect(): void {}

  makeMeAdmin(): void {}

  async getWhiteListFeedback(): Promise<void> {}
}
