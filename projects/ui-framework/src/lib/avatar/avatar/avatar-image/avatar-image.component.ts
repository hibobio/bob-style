import {
  Component,
  ElementRef,
  Input,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges,
  OnInit,
  HostListener,
  EventEmitter,
  Output,
  NgZone,
  AfterViewInit,
} from '@angular/core';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { AvatarSize, AvatarBadge } from '../avatar.enum';
import { Icons, IconColor } from '../../../icons/icons.enum';
import {
  applyChanges,
  notFirstChanges,
  getKeyByValue,
} from '../../../services/utils/functional-utils';
import { AvatarIconSize, AvatarBadges, BadgeSize } from '../avatar.consts';
import { BadgeConfig } from '../avatar.interface';
import { Icon } from '../../../icons/icon.interface';

@Component({
  selector: 'b-avatar-image',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./avatar-image.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarImageComponent implements OnChanges, OnInit, AfterViewInit {
  constructor(
    private elRef: ElementRef,
    private DOM: DOMhelpers,
    private zone: NgZone
  ) {
    this.host = this.elRef.nativeElement;
  }

  private host: HTMLElement;
  private hasContent = false;

  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() imageSource: string;
  @Input() backgroundColor: string;
  @Input() icon: Icons | Icon;
  @Input() badge: AvatarBadge | Icon;
  @Input() disabled = false;
  @Input() isClickable = false;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('click.outside-zone') onHostClick() {
    if (this.clicked.observers) {
      this.zone.run(() => {
        this.clicked.emit();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(
      this,
      changes,
      {
        size: AvatarSize.mini,
        disabled: false,
      },
      []
    );
    if (notFirstChanges(changes)) {
      this.setAttributes();
    }
  }

  ngOnInit() {
    this.setAttributes();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasContent = !this.DOM.isEmpty(this.host);
        if (this.hasContent) {
          this.setAttributes();
        }
      }, 0);
    });
  }

  private setAttributes(): void {
    const isClickable = this.isClickable || this.clicked.observers.length > 0;

    if (
      this.imageSource &&
      this.imageSource.indexOf('filestack') > -1 &&
      this.imageSource.indexOf('align=faces') === -1
    ) {
      console.warn(`AvatarImageComponent: Please check your imageSource -
you should be using EmployeeAvatarService.getOptimizedAvatarImage
to get the right avatar image.`);
    }

    this.DOM.setCssProps(this.host, {
      '--avatar-size': this.size + 'px',
      '--bg-color': this.backgroundColor || null,
      '--avatar-image':
        this.imageSource && !this.imageSource.includes('emptyAvatar')
          ? `url(${this.imageSource})`
          : null,
    });

    this.DOM.setAttributes(this.host, {
      role: 'img',
      'data-disabled': this.disabled || null,
      tabindex: isClickable && !this.disabled ? '0' : null,

      'data-size': getKeyByValue(AvatarSize, this.size),
      'data-icon-before-size':
        (this.icon && (this.icon as Icon).size) || AvatarIconSize[this.size],
      'data-icon-after-size': BadgeSize[this.size],

      'data-icon-before':
        !this.hasContent && this.icon
          ? ((this.icon as Icon).icon || (this.icon as string)).replace(
              'b-icon-',
              ''
            )
          : !this.hasContent && !this.imageSource && !this.icon
          ? Icons.person.replace('b-icon-', '')
          : null,
      'data-icon-before-color':
        this.icon && (this.icon as Icon).color
          ? (this.icon as Icon).color
          : this.imageSource
          ? IconColor.white
          : IconColor.normal,

      'data-icon-after': this.badge
        ? (
            (this.badge as BadgeConfig).icon ||
            AvatarBadges[this.badge as AvatarBadge].icon
          ).replace('b-icon-', '')
        : null,
      'data-icon-after-color': this.badge
        ? (this.badge as BadgeConfig).color ||
          AvatarBadges[this.badge as AvatarBadge].color
        : null,
    });

    this.DOM.bindClasses(this.host, {
      avatar: true,
      'has-hover': isClickable && !this.disabled,
      'icon-on-hover': Boolean(
        this.imageSource && (this.icon || this.hasContent)
      ),
      'has-content': this.hasContent,
    });

    if (!this.host.className) {
      this.host.removeAttribute('class');
    }
  }
}
