import { AvatarImageComponent } from '../avatar/avatar/avatar-image/avatar-image.component';
import { IconComponent } from '../icons/icon.component';
import { RenderedComponent } from '../services/component-renderer/component-renderer.interface';

export interface SelectGroupOption {
  groupName: string;
  groupIndex?: number;
  key?: string | number;
  options: SelectOption[];
  description?: string;
  selected?: boolean;
  hidden?: boolean;

  groupSelectedIDs?: (number | string)[];
  groupSelectedValues?: string[];
  selectedCount?: number;
  [key: string]: any;
}

export interface SelectOption {
  id: number | string;
  value: string;
  selected?: boolean;
  prefixComponent?: RenderedComponent<AvatarImageComponent | IconComponent>;
  disabled?: boolean;
  hidden?: boolean;
  description?: string;
  canBeDeleted?: boolean;
  [key: string]: any;
}

export interface ListHeader
  extends Omit<
    SelectGroupOption,
    'options' | 'groupSelectedIDs' | 'groupSelectedValues'
  > {
  isCollapsed: boolean;
  placeHolderSize: number;
  indeterminate?: boolean;
  groupIsOption?: boolean;
  hasCheckbox?: boolean;
}

export interface ListOption
  extends SelectOption,
    Omit<
      SelectGroupOption,
      'options' | 'groupSelectedIDs' | 'groupSelectedValues' | 'selectedCount'
    > {
  isPlaceHolder?: boolean;
  exclusive?: boolean;
}

export interface ListFooterActions {
  apply?: boolean | string;
  cancel?: boolean | string;
  clear?: boolean | string;
  reset?: boolean | string;
}

export interface ActionsButtonState {
  disabled?: boolean;
  hidden?: boolean;
}

export interface ListFooterActionsState {
  apply?: ActionsButtonState;
  cancel?: ActionsButtonState;
  clear?: ActionsButtonState;
  reset?: ActionsButtonState;
}

export interface UpdateListsConfig {
  collapseHeaders?: boolean;
  updateListHeaders?: boolean;
  updateListOptions?: boolean;
  updateListMinHeight?: boolean;
  selectedIDs?: (string | number)[];
  isSearching?: boolean;
}
