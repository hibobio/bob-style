import { MenuItem } from '../navigation/menu/menu.interface';

export interface CardContent {
  text?: string;
  subText?: string;
  id?: string | number;
}

export interface CardData {
  data: CardContent;
  menu?: MenuItem[];
}

export interface CardEmployee {
  imageSource: string;
  title: string;
  subtitle: string;
  id?: string;
}

export interface AddCardData {
  title: string;
  subtitle?: string;
  action?: (...args: any[]) => void;
}
