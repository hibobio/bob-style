import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Icon } from '../../../icons/icon.interface';
import { IconColor, Icons } from '../../../icons/icons.enum';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import {
  applyChanges,
  firstChanges,
  getKeyByValue,
  hasChanges,
  isNumber,
  isObject,
  isString,
  notFirstChanges,
  objectRemoveEntriesByValue,
} from '../../../services/utils/functional-utils';
import { log } from '../../../services/utils/logger';
import { valueAsNumber } from '../../../services/utils/transformers';
import { AvatarBadges, AvatarIconSize, BadgeSize } from '../avatar.consts';
import { AvatarBadge, AvatarSize } from '../avatar.enum';
import { Avatar, BadgeConfig } from '../avatar.interface';

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
  constructor(private elRef: ElementRef, private DOM: DOMhelpers, private zone: NgZone, private cd: ChangeDetectorRef) {
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
  @Input() badge: AvatarBadge | Icon | BadgeConfig;
  @Input() text: string | number;
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
      this.DOM.measure(() => {
        if (!this.hasContent && this.checkIfHasContent()) {
          this.setAttributes(true);
        }
      });
    });
  }

  private setAttributes(hasContent = false): void {
    this.zone.runOutsideAngular(() => {
      this.DOM.mutate(() => {
        const isClickable = this.isClickable !== false && (this.isClickable || this.clicked.observers.length > 0);
        this.hasContent = hasContent || this.checkIfHasContent();

        if (
          !this.supressWarnings &&
          this.imageSource &&
          this.imageSource.indexOf('filestack') > -1 &&
          !/default-avatars/.test(this.imageSource) &&
          !/align\W{1,2}faces/.test(this.imageSource)
        ) {
          const imgref = this.imageSource.split(/(?:filestackcontent\W{1,2}com\W{1,2})|(?:\W{0,1}\?)/i)[1];
          log.wrn(
            `Please check your imageSource ${imgref ? '(' + imgref + ')' : ''} -
you should be using EmployeeAvatarService.getOptimizedAvatarImage
to get the right avatar image.`,
            'AvatarImageComponent'
          );
        }

        if (this.host.getAttribute('data-tooltip')) {
          log.err(
            `You can not use data-tooltip attribute
on b-avatar-image element.`,
            'AvatarImageComponent'
          );
          this.host.removeAttribute('data-tooltip');
        }

        if (decodeURIComponent(this.imageSource).includes('default-avatars/default.png')) {
          this.imageSource = undefined;
        }

        this.DOM.setCssProps(this.host, {
          '--avatar-size': this.size + 'px',
          '--bg-color': this.backgroundColor || null,
          '--avatar-image':
            this.imageSource && !this.imageSource.includes('emptyAvatar')
              ? `url(${this.imageSource}),var(--avatar-image-def)`
              : null,
        });

        this.DOM.setAttributes(this.host, {
          role: 'img',
          'data-border': this.border === true,
          'data-disabled': this.disabled || null,
          tabindex: isClickable && !this.disabled ? '0' : null,
          'data-badge-align':
            this.badge === AvatarBadge.online || this.badge === AvatarBadge.offline ? 'bottom-right' : null,

          'data-size': getKeyByValue(AvatarSize, this.size),
          'data-icon-before-size': (this.icon as Icon)?.size || AvatarIconSize[this.size],
          'data-icon-after-size': BadgeSize[this.size],

          'data-icon-before':
            !this.hasContent && this.icon
              ? ((this.icon as Icon).icon || (this.icon as string))?.replace('b-icon-', '') || null
              : !this.hasContent && !this.imageSource && !this.icon && this.icon !== null
              ? Icons.person.replace('b-icon-', '')
              : null,
          'data-icon-before-color': (this.icon as Icon)?.color
            ? (this.icon as Icon).color
            : this.imageSource
            ? IconColor.white
            : IconColor.normal,

          'data-icon-after': this.badge
            ? ((this.badge as BadgeConfig).icon || AvatarBadges[this.badge as AvatarBadge].icon).replace('b-icon-', '')
            : null,
          'data-icon-after-color': this.badge
            ? (this.badge as BadgeConfig).color || AvatarBadges[this.badge as AvatarBadge].color
            : null,
        });

        this.DOM.bindClasses(this.host, {
          avatar: true,
          'has-hover': isClickable && !this.disabled,
          'icon-on-hover': Boolean(this.imageSource && (this.icon || this.hasContent)),
          'has-content': this.hasContent,
        });

        if (!this.host.className) {
          this.host.removeAttribute('class');
        }
      });
    });
  }

  private checkIfHasContent(): boolean {
    return Boolean(isNumber(this.text) || (isString(this.text) && this.text.trim()) || !this.DOM.isEmpty(this.host));
  }
}
