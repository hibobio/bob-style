import { Icons } from '../../icons/icons.enum';

export enum SocialType  {
  Facebook = 'facebook',
  Linkedin = 'linkedin',
  Twitter = 'twitter'
}

export interface SocialInputConfig {
  icon: Icons;
  prefix: string;
}


const facebook: SocialInputConfig = {
  icon: Icons.facebook,
  prefix: 'www.facebook.com/'
};

const linkedin: SocialInputConfig = {
  icon: Icons.linkedin,
  prefix: 'www.linkedin.com/'
};

const twitter: SocialInputConfig = {
  icon: Icons.twitter,
  prefix: 'www.twitter.com/'
};

export const socialTypesConfig = {
  facebook,
  linkedin,
  twitter
};
