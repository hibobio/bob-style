import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostBinding,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  NgZone,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { AvatarSize, AvatarBadge, AvatarOrientation } from './avatar.enum';
import { ChipType } from '../../chips/chips.enum';
import { Chip } from '../../chips/chips.interface';
import { BadgeConfig } from './avatar.interface';
import {
  getKeyByValue,
  notFirstChanges,
} from '../../services/utils/functional-utils';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { Icons } from '../../icons/icons.enum';
import { Icon } from '../../icons/icon.interface';
import { AvatarImageComponent } from './avatar-image/avatar-image.component';

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

  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() imageSource: string;
  @Input() backgroundColor: string;
  @Input() icon: Icons | Icon;
  @Input() badge: AvatarBadge | BadgeConfig | Icon;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() chip: Chip;
  @Input() caption: string;
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

  ngOnChanges(changes: SimpleChanges): void {
    this.isClickable =
      this.isClickable ||
      (this.isClickable !== false && this.clicked.observers.length > 0);

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  onClick(event: MouseEvent): void {
    if (this.isClickable) {
      this.zone.run(() => {
        this.clicked.emit(event);
      });
    }
  }
}
