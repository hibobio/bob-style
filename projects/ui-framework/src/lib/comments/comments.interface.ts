import { itemID } from '../lists/list.interface';
import {
  CommonActionButton,
  MenuItem,
} from '../navigation/menu/menu.interface';

export interface CommentItem {
  id?: itemID;
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
