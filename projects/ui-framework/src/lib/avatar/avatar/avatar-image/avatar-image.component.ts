import {
  Component,
  ElementRef,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges,
  OnInit,
  HostListener,
  EventEmitter,
  Output,
  NgZone,
} from '@angular/core';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { AvatarSize, AvatarBadge } from '../avatar.enum';
import { Icons, IconColor } from '../../../icons/icons.enum';
import {
  applyChanges,
  notFirstChanges,
  getKeyByValue,
} from '../../../services/utils/functional-utils';
import { AvatarIconSize, AvatarBadges } from '../avatar.consts';
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
export class AvatarImageComponent implements OnChanges, OnInit {
  constructor(
    private elRef: ElementRef,
    private DOM: DOMhelpers,
    private zone: NgZone
  ) {
    this.host = this.elRef.nativeElement;
  }

  private host: HTMLElement;
  private badgeConfig: BadgeConfig;
  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() imageSource: string;
  @Input() backgroundColor?: string;
  @Input() icon: Icons | Icon;
  @Input() badge: AvatarBadge | Icon;
  @Input() disabled = false;

  @HostBinding('attr.role') role = 'img';

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
    this.badgeConfig =
      this.badge &&
      ((this.badge as BadgeConfig).icon
        ? (this.badge as BadgeConfig)
        : AvatarBadges[this.badge as AvatarBadge]);

    this.setAttributes();
  }

  private setAttributes(): void {
    console.log('setAttributes icons', this.icon);
    this.DOM.setCssProps(this.host, {
      '--avatar-size': this.size + 'px',
      '--bg-color': this.backgroundColor || null,
      '--avatar-image': this.imageSource ? `url(${this.imageSource})` : null,
    });

    this.host.setAttribute(
      'data-size',
      getKeyByValue(AvatarSize, this.size || AvatarSize.mini)
    );

    this.host.setAttribute(
      'data-icon-before-size',
      (this.icon as Icon).size ||
        AvatarIconSize[this.size] ||
        AvatarIconSize[AvatarSize.mini]
    );

    if (this.icon) {
      this.host.setAttribute(
        'data-icon-before',
        ((this.icon as Icon).icon || (this.icon as string)).replace(
          'b-icon-',
          ''
        )
      );

      this.host.setAttribute(
        'data-icon-before-color',
        (this.icon as Icon).color || this.imageSource
          ? IconColor.white
          : IconColor.dark
      );
    } else {
      this.host.removeAttribute('data-icon-before');
      this.host.removeAttribute('data-icon-before-color');
    }

    if (this.disabled) {
      this.host.setAttribute('data-disabled', 'true');
    } else {
      this.host.removeAttribute('data-disabled');
    }

    if (this.clicked.observers.length > 0) {
      this.host.classList.add('has-hover');
    } else {
      this.host.classList.remove('has-hover');
    }

    if (this.imageSource && this.icon) {
      this.host.classList.add('icon-on-hover');
    } else {
      this.host.classList.remove('icon-on-hover');
    }

    if (!this.imageSource && !this.icon) {
      this.host.setAttribute(
        'data-icon-before',
        Icons.person.replace('b-icon-', '')
      );
    }

    if (!this.host.className) {
      this.host.removeAttribute('class');
    }
  }
}
