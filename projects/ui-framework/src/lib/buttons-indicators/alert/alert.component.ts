import {Component, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Dictionary} from 'lodash';
import {IconColor, Icons, IconSize} from '../../icons/icons.enum';
import {InfoStripIcon} from '../info-strip/info-strip.types';
import {AlertConfig} from './alert.interface';

@Component({
  selector: 'b-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @ViewChild('alertTemplateRef') alertTemplateRef: TemplateRef<any>;
  public alertConfig: AlertConfig;
  public closeAlertCallback: Function;
  readonly iconSize: IconSize = IconSize.xLarge;
  readonly iconsDic: Dictionary<InfoStripIcon> = {
    warning: { color: IconColor.primary, icon: Icons.warning },
    error: { color: IconColor.negative, icon: Icons.error },
    success: { color: IconColor.positive, icon: Icons.success },
    information: { color: IconColor.inform, icon: Icons.baseline_info_icon },
  };

  constructor(public viewContainerRef: ViewContainerRef) { }

  public closeAlert(): void {
    this.closeAlertCallback();
  }
}
