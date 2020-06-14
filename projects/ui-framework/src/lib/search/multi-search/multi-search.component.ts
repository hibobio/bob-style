import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  MultiSearchGroupOption,
  MultiSearchOption,
  MultiSearchClickedEvent,
} from './multi-search.interface';
import { MULTI_SEARCH_KEYMAP_DEF } from './multi-search.const';
import { isFunction, simpleUID } from '../../services/utils/functional-utils';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';

@Component({
  selector: 'b-multi-search',
  templateUrl: './multi-search.component.html',
  styleUrls: ['./multi-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSearchComponent {
  constructor(private cd: ChangeDetectorRef) {}

  @Input() options: MultiSearchGroupOption[] = [];

  @Input() label: string;
  @Input() placeholder: string;

  @Output() clicked: EventEmitter<MultiSearchClickedEvent> = new EventEmitter<
    MultiSearchClickedEvent
  >();

  public id = simpleUID('bms-');
  public inputFocused: boolean;

  readonly keyMapDef = { ...MULTI_SEARCH_KEYMAP_DEF };
  readonly avatarSize = AvatarSize;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;
  readonly iconBgColor = '#f57738';

  public onSearchFocus(): void {}

  public onSearchChange(value: string): void {}

  public onOptionClick(
    group: MultiSearchGroupOption,
    option: MultiSearchOption
  ): void {
    console.log(
      `Clicked: ${
        group[group.keyMap?.groupName || MULTI_SEARCH_KEYMAP_DEF.groupName]
      } - ${option[group.keyMap?.value || MULTI_SEARCH_KEYMAP_DEF.value]}`
    );

    if (isFunction(group.optionClickHandler)) {
      group.optionClickHandler(option);
    }

    if (this.clicked.observers.length) {
      this.clicked.emit({
        group,
        option,
      });
    }
  }

  public groupTrackBy(index: number, group: MultiSearchGroupOption): string {
    return (
      group[group.keyMap?.key || MULTI_SEARCH_KEYMAP_DEF.key] ||
      group[group.keyMap?.groupName || MULTI_SEARCH_KEYMAP_DEF.groupName] ||
      index
    );
  }

  public optionTrackBy(groupIndex: number, group: MultiSearchGroupOption) {
    return (index: number, option: MultiSearchOption): string => {
      return `${this.groupTrackBy(groupIndex, group)}__${
        option[group.keyMap?.id || MULTI_SEARCH_KEYMAP_DEF.id] ||
        option[group.keyMap?.value || MULTI_SEARCH_KEYMAP_DEF.value] ||
        index
      }`;
    };
  }
}
