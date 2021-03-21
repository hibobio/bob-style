import { CommonActionButton, MenuItem } from '../navigation/menu/menu.interface';

export interface CommentItem {
  avatar: string;
  content: string;
  name?: string;
  date?: string;
  actionConfig?: CommonActionButton;
  menuConfig?: MenuItem[];
}
export interface CommentItemDto {
  content: string;
}
