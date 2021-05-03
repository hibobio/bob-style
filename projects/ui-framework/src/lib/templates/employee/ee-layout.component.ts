import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { Avatar } from '../../avatar/avatar/avatar.interface';
import { Types } from '../../enums';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { hasChanges } from '../../services/utils/functional-utils';
import { EE_LAYOUT_CONFIG_BY_TYPE } from './ee-layout.const';
import { EELayoutConfig } from './ee-layout.interface';

@Component({
  selector: 'b-ee-layout, [b-ee-layout]',
  templateUrl: './ee-layout.component.html',
  styleUrls: ['./ee-layout.component.scss'],
})
export class EELayoutComponent implements OnChanges, AfterViewInit {
  constructor(
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChild('header') header: ElementRef<HTMLElement>;
  @ViewChild('title') title: ElementRef<HTMLElement>;

  @HostBinding('attr.data-type') @Input() type: Types = Types.primary;

  @Input() config: EELayoutConfig = EE_LAYOUT_CONFIG_BY_TYPE[Types.primary];

  @Input() avatar: Avatar;

  public hasHeader = true;
  public hasTitle = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, ['type', 'config'])) {
      this.config = {
        ...(Object.keys(EE_LAYOUT_CONFIG_BY_TYPE).includes(this.type) &&
          EE_LAYOUT_CONFIG_BY_TYPE[this.type]),
        ...(changes.config?.currentValue || this.config),
      };
    }
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasHeader = this.DOM.isEmpty(this.header.nativeElement);
        this.hasTitle = this.DOM.isEmpty(this.title.nativeElement);

        this.cd.detectChanges();
      }, 0);
    });
  }
}
