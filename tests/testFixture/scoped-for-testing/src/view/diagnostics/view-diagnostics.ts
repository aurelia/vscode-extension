import { PrivateService } from './PrivateService';

@customElement({ name: 'view-diagnostics', template })
export class ViewDiagnostics {
  @bindable fooBar;

  constructor(private privateService: PrivateService) {}
}
