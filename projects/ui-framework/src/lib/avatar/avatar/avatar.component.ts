import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostBinding,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  NgZone,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { AvatarSize, AvatarBadge, AvatarOrientation } from './avatar.enum';
import { AvatarBadges, BadgeSize } from './avatar.consts';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { ChipType } from '../../chips/chips.enum';
import { Chip } from '../../chips/chips.interface';
import { BadgeConfig } from './avatar.interface';
import {
  getKeyByValue,
  notFirstChanges,
  applyChanges,
} from '../../services/utils/functional-utils';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { Styles } from '../../services/html/html-helpers.interface';

@Component({
  selector: 'b-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent implements OnChanges, OnInit, AfterViewInit {
  constructor(
    private host: ElementRef,
    private DOM: DOMhelpers,
    private cd: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  @ViewChild('content', { static: false }) private content: ElementRef;

  public hasContent = true;
  public avatarClass: string = null;
  public avatarStyle: Styles = null;
  public badgeConfig: BadgeConfig;

  readonly avatarSize = AvatarSize;
  readonly badgeSize = BadgeSize;
  readonly chipType = ChipType;
  readonly orient = AvatarOrientation;
  readonly tooltipType = TruncateTooltipType;

  @Input() imageSource: string;
  @Input() backgroundColor?: string;
  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() chip: Chip;
  @Input() caption: string;
  @Input() badge: AvatarBadge | BadgeConfig;
  @Input() expectChanges = false;

  @Output() clicked?: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  @HostBinding('attr.data-size') get sizeClass() {
    return getKeyByValue(AvatarSize, this.size);
  }
  @HostBinding('attr.data-orientation')
  @Input()
  orientation: AvatarOrientation = AvatarOrientation.horizontal;
  @HostBinding('attr.data-clickable') @Input() isClickable = false;
  @HostBinding('attr.data-disabled') @Input() disabled = false;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (notFirstChanges(changes, ['size'])) {
      this.setCssVars();
    }

    if (changes.imageSource) {
      this.avatarClass =
        this.imageSource &&
        'avatar' +
          (this.imageSource && this.imageSource.includes('emptyAvatar')
            ? ' emptyAvatar'
            : this.imageSource && this.imageSource.includes('default-avatars')
            ? ' defaultAvatar'
            : !this.imageSource
            ? ' noAvatar'
            : '');
    }

    if (changes.imageSource || changes.backgroundColor) {
      this.avatarStyle = {
        backgroundImage: this.imageSource
          ? 'url(' + this.imageSource + ')'
          : null,
        backgroundColor: this.backgroundColor,
      };
    }

    if (changes.badge) {
      this.badgeConfig =
        this.badge &&
        ((this.badge as BadgeConfig).icon
          ? (this.badge as BadgeConfig)
          : AvatarBadges[this.badge as AvatarBadge]);
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.setCssVars();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasContent =
          this.content && !this.DOM.isEmpty(this.content.nativeElement);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  onClick(event: MouseEvent): void {
    if (this.isClickable && this.clicked.observers.length > 0) {
      this.zone.run(() => {
        this.clicked.emit(event);
      });
    }
  }

  private setCssVars(): void {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--avatar-size': this.size + 'px',
    });
  }
}
