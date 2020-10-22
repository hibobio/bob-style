import { ChangeDetectorRef, Component } from '@angular/core';
import { Dictionary } from 'lodash';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';
import { InfoStripIcon } from '../../../indicators/info-strip/info-strip.types';
import { AlertConfig } from '../alert.interface';
import { ButtonType } from '../../../buttons/buttons.enum';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger
} from '@angular/animations';

@Component({
  selector: 'b-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('toastAnimation', [
      transition('void => enter', [
        animate(
          '500ms cubic-bezier(0.2 ,2 , 0.5, 1)',
          keyframes([
            style({ offset: 0, transform: 'translateY(-60px)', opacity: 0 }),
            style({ offset: 1, transform: 'translateY(0)', opacity: 1 })
          ])
        )
      ]),
      transition('enter => leave', [
        animate(
          '500ms cubic-bezier(0.8 ,-1, 0.5, 1)',
          keyframes([
            style({ offset: 0, transform: 'translateY(0)', opacity: 1 }),
            style({ offset: 1, transform: 'translateY(-60px)', opacity: 0 })
          ])
        )
      ])
    ])
  ]
})
export class AlertComponent {
  public alertConfig: AlertConfig;
  public closeAlertCallback: Function;
  public animationState: 'void' | 'enter' | 'leave' = 'void';
  readonly iconSize: IconSize = IconSize.xLarge;
  readonly iconsDic: Dictionary<InfoStripIcon> = {
    warning: { color: IconColor.primary_alt, icon: Icons.error_alt },
    error: { color: IconColor.negative, icon: Icons.warning },
    success: { color: IconColor.positive, icon: Icons.success },
    information: { color: IconColor.inform, icon: Icons.baseline_info_icon }
  };
  readonly closeButtonType: ButtonType = ButtonType.tertiary;
  readonly closeButtonIcon: Icons = Icons.close;

  constructor(private cd: ChangeDetectorRef) {}

  public closeAlert(): void {
    this.animationState = 'leave';
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public onAnimationDone(event): void {
    if (event.toState === 'leave') {
      this.closeAlertCallback();
    }
  }
}
