import {
  Component,
  Input,
  HostBinding,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { IconColor, Icons, IconSize, IconType, IconRotate } from './icons.enum';
import {
  notFirstChanges,
  applyChanges,
} from '../services/utils/functional-utils';

@Component({
  selector: 'b-icon, [b-icon]',
  template: `
    <span class="b-icon" [ngClass]="iconClass" aria-hidden="true"></span>
  `,
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnChanges {
  constructor(private cd: ChangeDetectorRef) {}

  @Input() icon: Icons;
  @Input() color: IconColor = IconColor.dark;
  @Input() hasHoverState = false;

  @HostBinding('attr.data-size') @Input() size: IconSize = IconSize.medium;
  @HostBinding('attr.data-type') @Input() type: IconType = IconType.regular;
  @HostBinding('attr.data-tooltip') @Input() toolTipSummary: string = null;
  @HostBinding('attr.data-rotate') @Input() rotate: IconRotate = null;

  public iconClass: string = null;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes, {
      color: IconColor.dark,
    });

    this.iconClass =
      this.icon +
      ' b-icon-' +
      this.size +
      ' b-icon-' +
      this.color +
      (this.hasHoverState ? ' has-hover' : '');

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
