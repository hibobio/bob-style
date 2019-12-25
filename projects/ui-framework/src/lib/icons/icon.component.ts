import {
  Component,
  Input,
  HostBinding,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { IconColor, Icons, IconSize } from './icons.enum';
import {
  notFirstChanges,
  applyChanges,
} from '../services/utils/functional-utils';

@Component({
  selector: 'b-icon',
  template: `
    <span class="b-icon" [ngClass]="iconClass" aria-hidden="true"></span>
  `,
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnChanges {
  constructor(private cd: ChangeDetectorRef) {}

  @Input() icon: Icons;
  @Input() size: IconSize = IconSize.medium;
  @Input() color: IconColor = IconColor.dark;
  @Input() hasHoverState = false;

  @HostBinding('attr.data-tooltip') @Input() toolTipSummary: string = null;

  public iconClass: string = null;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

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
