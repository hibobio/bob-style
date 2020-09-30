import {
  Component,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import {
  TooltipClass,
  TooltipPosition,
} from '../../popups/tooltip/tooltip.enum';

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

  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly infoIcon = Icons.info_outline.replace('b-icon-', '');
  readonly tooltipPosition = TooltipPosition.above;
  readonly tooltipDelay = 300;
  readonly tooltipClass: TooltipClass[] = [
    TooltipClass.TextLeft,
    TooltipClass.PreWrap,
  ];
}
