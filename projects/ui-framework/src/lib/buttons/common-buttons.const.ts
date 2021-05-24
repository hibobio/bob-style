import { IconColor, Icons } from '../icons/icons.enum';
import { ButtonType } from './buttons.enum';
import { Button } from './buttons.interface';

export const BUTTON_CONFIG: Record<'trigger', Button> = {
  trigger: {
    type: ButtonType.tertiary,
    icon: Icons.three_dots_vert,
    color: IconColor.normal,
  },
};
