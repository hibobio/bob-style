import {
  animate,
  AnimationEvent,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectorRef, Component } from '@angular/core';

import { ButtonType } from '../../../buttons/buttons.enum';
import { Button } from '../../../buttons/buttons.interface';
import { Icon } from '../../../icons/icon.interface';
import { Icons, IconSize } from '../../../icons/icons.enum';
import { INFOSTRIP_ICON_DICT } from '../../../indicators/info-strip/info-strip.const';
import { InfoStripIconType } from '../../../indicators/info-strip/info-strip.enum';
import { AlertConfig } from '../alert.interface';

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
            style({ offset: 1, transform: 'translateY(0)', opacity: 1 }),
          ])
        ),
      ]),
      transition('enter => leave', [
        animate(
          '500ms cubic-bezier(0.8 ,-1, 0.5, 1)',
          keyframes([
            style({ offset: 0, transform: 'translateY(0)', opacity: 1 }),
            style({ offset: 1, transform: 'translateY(-60px)', opacity: 0 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class AlertComponent {
  constructor(private cd: ChangeDetectorRef) {}

  public alertConfig: AlertConfig;
  public closeAlertCallback: Function;
  public animationState: 'void' | 'enter' | 'leave' = 'void';

  readonly closeButton: Button = {
    type: ButtonType.tertiary,
    icon: Icons.close,
  };

  readonly iconsDic: Record<InfoStripIconType, Icon> = INFOSTRIP_ICON_DICT;
  readonly iconSize = IconSize.xLarge;

  public closeAlert(): void {
    this.animationState = 'leave';
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'leave') {
      this.closeAlertCallback();
    }
  }
}
