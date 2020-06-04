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
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;
  readonly delay = 300;
  readonly tooltipPosition = TooltipPosition;
  readonly tooltipClass: TooltipClass[] = [
    TooltipClass.TextLeft,
    TooltipClass.PreWrap,
  ];
}
