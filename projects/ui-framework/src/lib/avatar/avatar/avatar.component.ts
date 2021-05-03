import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { ChipType } from '../../chips/chips.enum';
import { Chip } from '../../chips/chips.interface';
import { Icon } from '../../icons/icon.interface';
import { Icons } from '../../icons/icons.enum';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import {
  getKeyByValue,
  isFunction,
  isObject,
  notFirstChanges,
  objectRemoveEntriesByValue,
} from '../../services/utils/functional-utils';
import { AvatarImageComponent } from './avatar-image/avatar-image.component';
import { AvatarBadge, AvatarOrientation, AvatarSize } from './avatar.enum';
import { Avatar, BadgeConfig } from './avatar.interface';

@Component({
  selector: 'b-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent implements OnChanges {
  constructor(private cd: ChangeDetectorRef, private zone: NgZone) {}

  @ViewChild(AvatarImageComponent) avatarImage: AvatarImageComponent;

  readonly avatarSize = AvatarSize;
  readonly chipType = ChipType;
  readonly orient = AvatarOrientation;
  readonly tooltipTypes = TruncateTooltipType;

  @Input('avatar') set setProps(avatar: Avatar) {
    if (isObject(avatar)) {
      Object.assign(this, objectRemoveEntriesByValue(avatar, [undefined]));
    }
  }

  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() imageSource: string;
  @Input() backgroundColor: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() caption: string;
  @Input() icon: Icons | Icon;
  @Input() badge: AvatarBadge | BadgeConfig | Icon;
  @Input() chip: Chip;
  @Input() afterChipText: string;
  @Input() isClickable = false;
  @Input() expectChanges = false;
  @Input() supressWarnings = false;
  @Input() tooltipType = TruncateTooltipType.css;

  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  @HostBinding('attr.data-size') get sizeClass() {
    return getKeyByValue(AvatarSize, this.size);
  }
  @HostBinding('attr.data-orientation')
  @Input()
  orientation: AvatarOrientation = AvatarOrientation.horizontal;

  @HostBinding('attr.data-disabled') @Input() disabled = false;

  onClick: (event: MouseEvent) => void;

  ngOnChanges(changes: SimpleChanges): void {
    this.isClickable =
      this.isClickable ||
      (this.isClickable !== false && this.clicked.observers.length > 0);

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  onAvatarClick(event: MouseEvent): void {
    if (this.isClickable) {
      this.zone.run(() => {
        isFunction(this.onClick) && this.onClick(event);
        this.clicked.emit(event);
      });
    }
  }
}
