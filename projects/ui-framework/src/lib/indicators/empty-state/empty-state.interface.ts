import { SafeResourceUrl } from '@angular/platform-browser';

import { Button } from '../../buttons/buttons.interface';
import { Icons, IconSize } from '../../icons/icons.enum';
import { NgClass } from '../../services/html/html-helpers.interface';

export interface EmptyStateConfig {
  title?: string;
  text?: string;

  icon: Icons;
  iconSize?: IconSize;

  imgSrc?: string | SafeResourceUrl;
  imgWidth?: number;

  button?: Button;
  buttonLabel?: string;
  buttonClick?: () => void;

  titleClass?: string | string[] | NgClass;
  textClass?: string | string[] | NgClass;
  buttonClass?: string | string[] | NgClass;
}
