import { Icons, IconSize } from '../../icons/icons.enum';

export interface EmptyStateConfig {
  text?: string;
  icon: Icons;
  iconSize?: IconSize;
  buttonLabel?: string;
  imgSrc?: string;
  buttonClick?: () => void;
}
