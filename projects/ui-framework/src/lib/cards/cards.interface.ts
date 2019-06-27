import { RenderedComponent } from '../services/component-renderer/component-renderer.interface';
import { MenuItem } from '../navigation/menu/menu.interface';
import { Avatar } from '../buttons-indicators/avatar/avatar.interface';

export interface CardDataType {
  text?: string;
  header?: string | RenderedComponent;
  footer?: string | RenderedComponent;
  avatar?: Avatar;
}

export interface CardData {
  data: CardDataType;
  menu?: MenuItem[];
}

export interface AddCardData {
  title: string;
  subtitle?: string;
  action: (...args: any[]) => void;
}

export interface CardClickEvent {
  cardIndex: number;
  card: CardData;
}
