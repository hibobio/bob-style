import { RowNode, GridOptions, GridApi } from 'ag-grid-community';
import { LicenseManager } from 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';

const LICENSE_KEY =
  'CompanyName=hibob,LicensedApplication=BOB,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-008172,ExpiryDate=19_May_2021_[v2]_MTYyMTM3ODgwMDAwMA==9881948aa1a535a25dcd3c056897f090';

export class AgGridWrapper {
  public gridOptions: GridOptions;
  public gridApi: GridApi;
  public agGrid: AgGridAngular;

  constructor() {
    LicenseManager.setLicenseKey(LICENSE_KEY);
  }

  public getApi(): GridApi {
    return (
      this.gridApi || (this.gridApi = this.gridOptions?.api || this.agGrid?.api)
    );
  }

  public setGridOptions(gridOptions: GridOptions) {
    this.gridOptions = gridOptions;
    this.gridApi = this.getApi();
  }

  public getDisplayedRowCount(): number {
    return this.getApi()?.getDisplayedRowCount();
  }

  public paginationGetCurrentPage(): number {
    return this.getApi()?.paginationGetCurrentPage();
  }

  public paginationGoToPage(page: number): void {
    this.getApi()?.paginationGoToPage(page);
  }

  public paginationSetPageSize(pageSize: number): void {
    this.getApi()?.paginationSetPageSize(pageSize);
  }

  public addRows(rows: any[]): void {
    this.getApi()?.updateRowData({ add: rows });
  }

  public filterRows(filterQuery: string): void {
    this.getApi()?.setQuickFilter(filterQuery);
  }

  public resetFilter(): void {
    this.getApi()?.resetQuickFilter();
  }

  public removeRows(rows: any[]): void {
    this.getApi()?.updateRowData({ remove: rows });
  }

  public updateRows(rowsData: any[]): void {
    this.getApi()?.updateRowData({ update: rowsData });
  }

  public getRow(rowIndex: string): RowNode {
    return this.getApi()?.getRowNode(rowIndex);
  }

  public deselectAll(): void {
    this.getApi()?.deselectAll();
  }
}
