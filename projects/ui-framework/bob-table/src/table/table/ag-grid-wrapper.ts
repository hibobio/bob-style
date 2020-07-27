import { RowNode, GridOptions, GridApi } from 'ag-grid-community';
import { LicenseManager } from 'ag-grid-enterprise';

const LICENSE_KEY =
  'CompanyName=hibob,LicensedApplication=BOB,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-008172,ExpiryDate=19_May_2021_[v2]_MTYyMTM3ODgwMDAwMA==9881948aa1a535a25dcd3c056897f090';

export class AgGridWrapper {
  public gridOptions: GridOptions;
  public gridApi: GridApi;

  constructor() {
    LicenseManager.setLicenseKey(LICENSE_KEY);
  }

  public setGridOptions(gridOptions: GridOptions) {
    this.gridOptions = gridOptions;
    this.gridApi = this.gridApi || this.gridOptions?.api;
  }

  public getDisplayedRowCount(): number {
    return this.gridApi?.getDisplayedRowCount();
  }

  public paginationGetCurrentPage(): number {
    return this.gridApi?.paginationGetCurrentPage();
  }

  public paginationGoToPage(page: number): void {
    this.gridApi?.paginationGoToPage(page);
  }

  public paginationSetPageSize(pageSize: number): void {
    this.gridApi?.paginationSetPageSize(pageSize);
  }

  public addRows(rows: any[]): void {
    this.gridApi?.updateRowData({ add: rows });
  }

  public filterRows(filterQuery: string): void {
    this.gridApi?.setQuickFilter(filterQuery);
  }

  public resetFilter(): void {
    this.gridApi?.resetQuickFilter();
  }

  public removeRows(rows: any[]): void {
    this.gridApi?.updateRowData({ remove: rows });
  }

  public updateRows(rowsData: any[]): void {
    this.gridApi?.updateRowData({ update: rowsData });
  }

  public getRow(rowIndex: string): RowNode {
    return this.gridApi?.getRowNode(rowIndex);
  }

  public deselectAll(): void {
    this.gridApi?.deselectAll();
  }
}
