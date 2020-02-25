import {ComponentType} from '@angular/cdk/overlay';
import {ColDef} from 'ag-grid-community';

export type HTML = string;

export interface TreeCellRendererComponent<D = any> {
  init(data: D): void;
}

export interface TreeConfig<D = any> {
  colDef?: ColDef;
  hierarchyGetter: (data) => string[];
  dataGetter?: (data) => D;
  groupDefaultExpanded?: number;
  suppressCount?: boolean;
  cellComponent?: ComponentType<TreeCellRendererComponent<D>>;
  cellTemplate?: (data: D) => HTML; // TODO: support components/templates.
}

export const defaultTreeConfig: Partial<TreeConfig> = {
  groupDefaultExpanded: -1,
  suppressCount: true,
  colDef: {
    resizable: true
  }
};
