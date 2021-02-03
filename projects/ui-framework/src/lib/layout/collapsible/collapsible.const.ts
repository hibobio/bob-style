import { Icons } from '../../icons/icons.enum';
import { CollapsibleStyle } from './collapsible.interface';

export const CHEVRON_ICONS = {
  up: Icons.chevron_up.replace('b-icon-', ''),
  down: Icons.chevron_down.replace('b-icon-', ''),
  left: Icons.chevron_left.replace('b-icon-', ''),
  right: Icons.chevron_right.replace('b-icon-', ''),
};

export const COLLAPSIBLE_STYLE_DEF: CollapsibleStyle = {
  sectionClass: 'brd rounded',
  headerClass:
    'flx flx-row-align-y b-subheading uppercase pad-l-8 pad-r-32 pad-y-16',
  panelClass: 'pad-x-32 pad-b-24',
};
