import { Component, Input } from '@angular/core';
import { TruncateTooltipPosition, TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { TooltipClass } from '../../enums';

@Component({
  selector: 'b-form-element-label',
  templateUrl: './form-element-label.component.html',
  styleUrls: ['./form-element-label.component.scss']
})
export class FormElementLabelComponent {

  @Input() label: string;
  @Input() description: string;
  @Input() fieldId: string | number;

  readonly truncateTooltipType = TruncateTooltipType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;
  readonly delay = 300;
  readonly truncateTooltipPosition = TruncateTooltipPosition;
  readonly tooltipClass: TooltipClass[] = [
    TooltipClass.TextLeft,
    TooltipClass.PreWrap,
  ];

}
