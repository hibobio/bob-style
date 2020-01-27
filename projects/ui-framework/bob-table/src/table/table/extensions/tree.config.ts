import {ColDef} from 'ag-grid-community';

export type HTML = string;

export interface TreeConfig<D = any> {
  colDef?: ColDef;
  hierarchyGetter: (data) => string[];
  dataGetter?: (data) => D;
  groupDefaultExpanded?: number;
  suppressCount?: boolean;
  cellTemplate?: (data: D) => HTML; // TODO: support components/templates.
}

export const defaultTreeConfig: Partial<TreeConfig> = {
  groupDefaultExpanded: -1,
  suppressCount: true,
  colDef: {
    resizable: true
  }
};
