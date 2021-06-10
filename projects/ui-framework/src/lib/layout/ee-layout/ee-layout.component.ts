import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { AvatarOrientation, AvatarSize } from '../../avatar/avatar/avatar.enum';
import { Avatar } from '../../avatar/avatar/avatar.interface';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { Types } from '../../enums';
import { Icons } from '../../icons/icons.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  hasChanges,
  mergeObjects,
} from '../../services/utils/functional-utils';
import { DOMMouseEvent } from '../../types';
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

  @HostBinding('attr.data-wide-sidebar') get isWideSidebar() {
    return String(this.config?.wideSidebar || false);
  }

  @Input() config: EELayoutConfig;

  @Input() avatar: Avatar;

  @Input() showNext: boolean;
  @Input() showPrev: boolean;
  @Input() disableNext: boolean;
  @Input() disablePrev: boolean;
  @Input() tooltipNext: string;
  @Input() tooltipPrev: string;

  @Output()
  nextClicked: EventEmitter<DOMMouseEvent> = new EventEmitter();
  @Output()
  prevClicked: EventEmitter<DOMMouseEvent> = new EventEmitter();

  readonly icons = Icons;
  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;

  public hasHeader = true;
  public hasSectionHeader = true;
  public hasContentHeader = true;
  public hasContentFooter = true;
  readonly avatarSize = AvatarSize;
  readonly avatarOrientation = AvatarOrientation;

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
