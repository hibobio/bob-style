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
  objectMapKeys,
  objectRemoveEntriesByValue,
} from '../../services/utils/functional-utils';
import { GenericObject } from '../../types';
import { AvatarImageComponent } from './avatar-image/avatar-image.component';
import { AvatarBadge, AvatarOrientation, AvatarSize } from './avatar.enum';
import { Avatar, AvatarInputCmnt, BadgeConfig } from './avatar.interface';

@Component({
  selector: 'b-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent implements OnChanges {
  constructor(private cd: ChangeDetectorRef, private zone: NgZone) {}

  @ViewChild(AvatarImageComponent) avatarImage: AvatarImageComponent;

  readonly avatarSizes = AvatarSize;
  readonly chipType = ChipType;
  readonly orient = AvatarOrientation;
  readonly tooltipTypes = TruncateTooltipType;

  @Input('avatar') set setProps(avatar: Avatar) {
    if (isObject(avatar)) {
      Object.assign(
        this,
        objectMapKeys<GenericObject, Avatar>(
          objectRemoveEntriesByValue(avatar, [undefined]),
          {
            avatarSize: 'size',
          }
        )
      );
    }
  }

  @Input() size: AvatarInputCmnt | AvatarSize = AvatarSize.mini;
  @Input() imageSource: AvatarInputCmnt | string;
  @Input() backgroundColor: AvatarInputCmnt | string;
  @Input() title: AvatarInputCmnt | string;
  @Input() subtitle: AvatarInputCmnt | string;
  @Input() caption: AvatarInputCmnt | string;
  @Input() icon: AvatarInputCmnt | Icons | Icon;
  @Input() badge: AvatarInputCmnt | AvatarBadge | BadgeConfig | Icon;
  @Input() chip: AvatarInputCmnt | Chip;
  @Input() afterChipText: AvatarInputCmnt | string;
  @Input() isClickable: AvatarInputCmnt | boolean = false;
  @Input() expectChanges: AvatarInputCmnt | boolean = false;
  @Input() supressWarnings: AvatarInputCmnt | boolean = false;
  @Input() tooltipType: AvatarInputCmnt | TruncateTooltipType =
    TruncateTooltipType.css;

  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  @HostBinding('attr.data-size') get sizeClass() {
    return getKeyByValue(AvatarSize, this.size);
  }
  @HostBinding('attr.data-orientation')
  @Input()
  orientation: AvatarInputCmnt | AvatarOrientation =
    AvatarOrientation.horizontal;

  @HostBinding('attr.data-disabled') @Input() disabled:
    | AvatarInputCmnt
    | boolean = false;

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
