import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { CollapsibleStyle } from './collapsible.interface';

export const COLLAPSIBLE_STYLE_DEF: CollapsibleStyle = {
  sectionClass: 'bg-white brd rounded',
  headerClass:
    'flx flx-row-align-y b-subheading uppercase pad-l-8 pad-r-32 pad-y-16',
  panelClass: 'pad-x-32 pad-b-24',

  chevronIcon: {
    icon: Icons.chevron_right,
    size: IconSize.large,
    color: IconColor.dark,
  },
};
