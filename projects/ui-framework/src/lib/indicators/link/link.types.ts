import { LinkColor, LinkTarget } from './link.enum';

export interface Link {
  text: string;
  url: string;
  color?: LinkColor;
  target?: LinkTarget;
}
