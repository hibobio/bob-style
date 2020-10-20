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
  ChangeDetectorRef,
} from '@angular/core';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { AvatarSize, AvatarBadge } from '../avatar.enum';
import { Icons, IconColor } from '../../../icons/icons.enum';
import {
  applyChanges,
  notFirstChanges,
  getKeyByValue,
  hasChanges,
  isObject,
  objectRemoveEntriesByValue,
  firstChanges,
  isString,
  isNumber,
} from '../../../services/utils/functional-utils';
import { AvatarIconSize, AvatarBadges, BadgeSize } from '../avatar.consts';
import { Avatar, BadgeConfig } from '../avatar.interface';
import { Icon } from '../../../icons/icon.interface';
import { valueAsNumber } from '../../../services/utils/transformers';

@Component({
  selector: 'b-avatar-image',
  template: `
    <ng-content></ng-content>
    {{ text }}
  `,
  styleUrls: ['./avatar-image.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarImageComponent implements OnChanges, OnInit, AfterViewInit {
  constructor(
    private elRef: ElementRef,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    this.host = this.elRef.nativeElement;
  }

  private host: HTMLElement;
  private hasContent = false;
  private initDone = false;

  @Input('avatar') set setProps(avatar: Avatar) {
    if (isObject(avatar)) {
      Object.assign(this, objectRemoveEntriesByValue(avatar, [undefined]));
    }
  }

  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() imageSource: string;
  @Input() backgroundColor: string;
  @Input() border = false;
  @Input() icon: Icons | Icon;
  @Input() badge: AvatarBadge | Icon;
  @Input() text: string;
  @Input() disabled = false;
  @Input() isClickable: boolean;
  @Input() supressWarnings = false;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('click.outside-zone') onHostClick() {
    if (this.clicked.observers) {
      this.zone.run(() => {
        this.clicked.emit();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(this, changes, {
      size: AvatarSize.mini,
      disabled: false,
    });

    if (firstChanges(changes, ['size', 'setProps'], true)) {
      this.size = valueAsNumber(
        true,
        this.size !== AvatarSize.mini
          ? this.size || changes.setProps?.currentValue?.size
          : changes.setProps?.currentValue?.size || this.size,
        AvatarSize.mini
      );
    }

    if (
      this.initDone &&
      (hasChanges(changes, ['text'], true, {
        checkEquality: true,
      }) ||
        notFirstChanges(changes, null, false, {
          checkEquality: true,
        }))
    ) {
      if (changes.text && !this.cd['destroyed']) {
        this.cd.detectChanges();
      }

      this.setAttributes();
    }
  }

  ngOnInit() {
    this.setAttributes();
    this.initDone = true;
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        if (!this.hasContent && this.checkIfHasContent()) {
          this.setAttributes(true);
        }
      }, 0);
    });
  }

  private setAttributes(hasContent = false): void {
    this.DOM.mutate(() => {
      const isClickable =
        this.isClickable !== false &&
        (this.isClickable || this.clicked.observers.length > 0);
      this.hasContent = hasContent || this.checkIfHasContent();

      if (
        !this.supressWarnings &&
        this.imageSource &&
        this.imageSource.indexOf('filestack') > -1 &&
        !/default-avatars/.test(this.imageSource) &&
        !/align\W{1,2}faces/.test(this.imageSource)
      ) {
        const imgref = this.imageSource.split(
          /(?:filestackcontent\W{1,2}com\W{1,2})|(?:\W{0,1}\?)/i
        )[1];
        console.warn(`AvatarImageComponent: Please check your imageSource ${
          imgref ? '(' + imgref + ')' : ''
        } -
you should be using EmployeeAvatarService.getOptimizedAvatarImage
to get the right avatar image.`);
      }

      if (this.host.getAttribute('data-tooltip')) {
        console.error(`AvatarImageComponent: You can not use data-tooltip attribute
on b-avatar-image element.`);
        this.host.removeAttribute('data-tooltip');
      }

      if (
        decodeURIComponent(this.imageSource).includes(
          'default-avatars/default.png'
        )
      ) {
        this.imageSource = undefined;
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
        'data-border': this.border === true,
        'data-disabled': this.disabled || null,
        tabindex: isClickable && !this.disabled ? '0' : null,
        'data-badge-align':
          this.badge === AvatarBadge.online ||
          this.badge === AvatarBadge.offline
            ? 'bottom-right'
            : null,

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
    });
  }

  private checkIfHasContent(): boolean {
    return Boolean(
      isNumber(this.text) ||
        (isString(this.text) && this.text.trim()) ||
        !this.DOM.isEmpty(this.host)
    );
  }
}
