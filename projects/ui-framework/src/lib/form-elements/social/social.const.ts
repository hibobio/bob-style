import { Icons } from '../../icons/icons.enum';
import { Social } from './social.enum';

export interface SocialInputConfig {
  icon: Icons;
  prefix: string;
  prefixShort: string;
  parseReplace?: any[];
}

export const SocialTypes: { [key in Social]: SocialInputConfig } = {
  [Social.facebook]: {
    icon: Icons.facebook,
    prefix: 'www.facebook.com/',
    prefixShort: 'facebook.com/',
  },
  [Social.linkedin]: {
    icon: Icons.linkedin,
    prefix: 'www.linkedin.com/in/',
    prefixShort: 'linkedin.com/in/',
    parseReplace: [{ a: '/in/', b: '/' }],
  },
  [Social.twitter]: {
    icon: Icons.twitter,
    prefix: 'www.twitter.com/',
    prefixShort: 'twitter.com/',
  },
};
