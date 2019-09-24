import { Component, Input } from '@angular/core';
import { TruncateTooltipPosition, TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { IconColor, Icons } from '../../icons/icons.enum';
import { TooltipClass } from '../../enums';

@Component({
  selector: 'b-form-element-label',
  templateUrl: './form-element-label.component.html',
  styleUrls: ['./form-element-label.component.scss']
})
export class FormElementLabelComponent {

  @Input() label: string;
  @Input() description: string;

  readonly truncateTooltipType = TruncateTooltipType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly delay = 300;
  readonly truncateTooltipPosition = TruncateTooltipPosition;
  readonly tooltipClass: TooltipClass[] = [
    TooltipClass.TextLeft,
    TooltipClass.PreWrap,
  ];

}
