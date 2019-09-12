import {CommonActionButton, MenuItem} from '../navigation/menu/menu.interface';

export interface CommentItem {
  avatar: string;
  name?: string;
  date?: string;
  content: string;
  actionConfig?: CommonActionButton;
  menuConfig?: MenuItem[];
}
export interface CommentItemDto {
  content: string;
}
