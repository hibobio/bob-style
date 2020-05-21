import { RowNode, GridOptions } from 'ag-grid-community';
import { LicenseManager } from 'ag-grid-enterprise';

const LICENSE_KEY =
  'CompanyName=hibob,LicensedApplication=BOB,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-008172,ExpiryDate=19_May_2021_[v2]_MTYyMTM3ODgwMDAwMA==9881948aa1a535a25dcd3c056897f090';

export class AgGridWrapper {
  public gridOptions: GridOptions;

  constructor() {
    LicenseManager.setLicenseKey(LICENSE_KEY);
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
}
