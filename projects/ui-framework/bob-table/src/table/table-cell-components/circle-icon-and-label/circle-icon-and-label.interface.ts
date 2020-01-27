import { ICellRendererParams } from 'ag-grid-community';
import {ButtonType, Icons, MenuItem} from 'bob-style';

export interface CircleIconAndLabelParams extends ICellRendererParams {
  value: {
    icon?: Icons;
    label?: string;
    menuItems?: MenuItem[];
    buttonType?: ButtonType;
  };
}
