import {RowNode, GridOptions} from 'ag-grid-community';
import {Constructor} from 'bob-style';
import {once} from 'lodash';

const LICENSE_KEY =
  'hibob_Bob_1Devs_1Deployment_23_April_2020__MTU4NzU5NjQwMDAwMA==5b77134bf43e27e7f8ccb20bdfa3c155';


let isLicenseSet = false;
export function WithAgGrid<C extends Constructor<{}>>(Base: C = (class {} as any)) {
  return class extends Base {

    readonly tableLicense = once(() =>
        // @ts-ignore
        import('ag-grid-enterprise').then(agGrig => {
          if (!isLicenseSet) {
            isLicenseSet = true;
            agGrig.LicenseManager.setLicenseKey(LICENSE_KEY);
          }
        })
    );

    public gridOptions: GridOptions;

    constructor(...args) {
      super(...args);
      this.tableLicense();
    }

    public setGridOptions(gridOptions: GridOptions) {
      this.gridOptions = gridOptions;
    }

    public getDisplayedRowCount(): number {
      return this.gridOptions.api.getDisplayedRowCount();
    }

    public addRows(rows: any[]): void {
      this.gridOptions.api.updateRowData({ add: rows });
    }

    public filterRows(filterQuery: string): void {
      this.gridOptions.api.setQuickFilter(filterQuery);
    }

    public resetFilter(): void {
      this.gridOptions.api.resetQuickFilter();
    }

    public removeRows(rows: any[]): void {
      this.gridOptions.api.updateRowData({ remove: rows });
    }

    public updateRows(rowsData: any[]): void {
      this.gridOptions.api.updateRowData({ update: rowsData });
    }

    public getRow(rowIndex: string): RowNode {
      return this.gridOptions.api.getRowNode(rowIndex);
    }

    public deselectAll(): void {
      this.gridOptions.api.deselectAll();
    }

  };
}
