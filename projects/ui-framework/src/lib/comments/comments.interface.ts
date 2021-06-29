import {
  CommonActionButton,
  MenuItem,
} from '../navigation/menu/menu.interface';

export interface CommentItem {
  id?: string;
  avatar: string;
  content: string;
  name?: string;
  role?: string;
  date?: string;
  actionConfig?: CommonActionButton;
  menuConfig?: MenuItem[];
}
export interface CommentItemDto {
  content: string;
}
