import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

import { ICON_CONFIG } from '../../icons/common-icons.const';
import {
  TooltipClass,
  TooltipPosition,
} from '../../popups/tooltip/tooltip.enum';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

@Component({
  selector: 'b-form-element-label',
  templateUrl: './form-element-label.component.html',
  styleUrls: ['./form-element-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormElementLabelComponent {
  constructor() {}
  @Input() label: string;
  @Input() description: string;
  @Input() fieldId: string | number;

  @HostBinding('class.bfe-label') classname = true;

  readonly truncateTooltipType = TruncateTooltipType;
  readonly infoIcon = ICON_CONFIG.info.icon.replace('b-icon-', '');
  readonly tooltipPosition = TooltipPosition.above;
  readonly tooltipDelay = 300;
  readonly tooltipClass: TooltipClass[] = [
    TooltipClass.TextLeft,
    TooltipClass.PreWrap,
  ];
}
