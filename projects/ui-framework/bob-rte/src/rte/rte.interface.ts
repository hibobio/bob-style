import { GenericObject } from 'bob-style';

export interface RteMentionsOption {
  id?: string | number;
  avatar?: string;
  displayName: string;
  link: string;
  attributes?: GenericObject;
}
