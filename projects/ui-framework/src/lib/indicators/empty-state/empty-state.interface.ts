import { SafeResourceUrl } from '@angular/platform-browser';
import { Button } from '../../buttons/buttons.interface';
import { Icons, IconSize } from '../../icons/icons.enum';

export interface EmptyStateConfig {
  text?: string;
  icon: Icons;
  iconSize?: IconSize;
  buttonLabel?: string;
  imgSrc?: string | SafeResourceUrl;
  button?: Button;
  buttonClick?: () => void;
}
