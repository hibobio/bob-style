import { ICellRendererParams } from 'ag-grid-community';
import { Icons } from 'bob-style';

export interface CircleIconAndLabelParams extends ICellRendererParams {
  value: {
    icon?: Icons;
    label?: string;
  };
}
