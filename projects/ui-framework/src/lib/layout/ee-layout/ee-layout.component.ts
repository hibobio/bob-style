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
import {
  hasChanges,
  mergeObjects,
} from '../../services/utils/functional-utils';
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
  @ViewChild('sectionHeader') sectionHeader: ElementRef<HTMLElement>;
  @ViewChild('contentHeader') contentHeader: ElementRef<HTMLElement>;
  @ViewChild('contentFooter') contentFooter: ElementRef<HTMLElement>;

  @HostBinding('attr.data-type') @Input() type: Types;

  @Input() config: EELayoutConfig = EE_LAYOUT_CONFIG_BY_TYPE[Types.primary];

  @Input() avatar: Avatar;

  public hasHeader = true;
  public hasSectionHeader = true;
  public hasContentHeader = true;
  public hasContentFooter = true;

  ngOnChanges(changes: SimpleChanges): void {
    //
    if (hasChanges(changes, ['type', 'config'])) {
      //
      this.config = mergeObjects<EELayoutConfig>(
        EE_LAYOUT_CONFIG_BY_TYPE[this.type],
        changes.config?.currentValue ||
          (changes.type && this.type === null ? {} : this.config)
      );
    }
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasHeader = !this.DOM.isEmpty(this.header.nativeElement);
        this.hasSectionHeader = !this.DOM.isEmpty(
          this.sectionHeader.nativeElement
        );
        this.hasContentHeader = !this.DOM.isEmpty(
          this.contentHeader.nativeElement
        );
        this.hasContentFooter = !this.DOM.isEmpty(
          this.contentFooter.nativeElement
        );
        this.cd.detectChanges();
      }, 0);
    });
  }
}
