import { RowNode, GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { LicenseManager } from 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';

const LICENSE_KEY =
  'CompanyName=hibob,LicensedApplication=BOB,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-008172,ExpiryDate=19_May_2021_[v2]_MTYyMTM3ODgwMDAwMA==9881948aa1a535a25dcd3c056897f090';

export class AgGridWrapper {
  public gridOptions: GridOptions;
  public gridApi: GridApi;
  public columnApi: ColumnApi;
  public agGrid: AgGridAngular;

  constructor() {
    LicenseManager.setLicenseKey(LICENSE_KEY);
  }

  public getGridApi(): GridApi {
    return (
      this.gridApi || (this.gridApi = this.gridOptions?.api || this.agGrid?.api)
    );
  }

  public getColumnApi(): ColumnApi {
    return (
      this.columnApi ||
      (this.columnApi = this.gridOptions?.columnApi || this.agGrid?.columnApi)
    );
  }

  public setGridOptions(gridOptions: GridOptions) {
    this.gridOptions = gridOptions;
    this.gridApi = this.getGridApi();
    this.columnApi = this.getColumnApi();
  }

  public getDisplayedRowCount(): number {
    return this.getGridApi()?.getDisplayedRowCount();
  }

  public paginationGetCurrentPage(): number {
    return this.getGridApi()?.paginationGetCurrentPage();
  }

  public paginationGoToPage(page: number): void {
    this.getGridApi()?.paginationGoToPage(page);
  }

  public paginationSetPageSize(pageSize: number): void {
    this.getGridApi()?.paginationSetPageSize(pageSize);
  }

  public addRows(rows: any[]): void {
    this.getGridApi()?.updateRowData({ add: rows });
  }

  public filterRows(filterQuery: string): void {
    this.getGridApi()?.setQuickFilter(filterQuery);
  }

  public resetFilter(): void {
    this.getGridApi()?.resetQuickFilter();
  }

  public removeRows(rows: any[]): void {
    this.getGridApi()?.updateRowData({ remove: rows });
  }

  public updateRows(rowsData: any[]): void {
    this.getGridApi()?.updateRowData({ update: rowsData });
  }

  public getRow(rowIndex: string): RowNode {
    return this.getGridApi()?.getRowNode(rowIndex);
  }

  public deselectAll(): void {
    this.getGridApi()?.deselectAll();
  }
}
