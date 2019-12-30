import {Directive, Input, OnInit, Host} from '@angular/core';
import {TableComponent} from '../table.component';
import {TreeConfig, defaultTreeConfig} from './tree.config';

function getFileCellRenderer(treeConfig: TreeConfig) {
  function FileCellRenderer() {}
  FileCellRenderer.prototype.init = function({value}) {
    this.value = value;
  };
  FileCellRenderer.prototype.getGui = function() {
    return treeConfig.cellTemplate ?
      treeConfig.cellTemplate(this.value) :
      this.value;
  };
  return FileCellRenderer;
}


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[treeConfig]'
})
export class TreeDirective implements OnInit {

  public treeConfig: TreeConfig = defaultTreeConfig;
  get table() {
    return this.tableComponent.agGrid;
  }

  @Input('treeConfig') set setTreeConfig(treeConfig: TreeConfig) {
    this.treeConfig = { ...defaultTreeConfig, ...treeConfig };
    this.applyTreeConfig(this.treeConfig);
  }

  constructor(@Host() private tableComponent: TableComponent) {
  }

  public ngOnInit(): void {
    this.tableComponent.addClass('tree-table');
  }

  private applyTreeConfig(treeConfig: TreeConfig) {
    this.tableComponent.agGrid.treeData = true;
    this.tableComponent.agGrid.getDataPath = treeConfig.hierarchyGetter;
    this.tableComponent.agGrid.groupDefaultExpanded = treeConfig.groupDefaultExpanded;
    this.tableComponent.agGrid.autoGroupColumnDef = {
      ...treeConfig.colDef,
      cellRendererParams: {
        suppressCount: treeConfig.suppressCount,
        innerRenderer: getFileCellRenderer(treeConfig)
      },
      valueGetter: treeConfig.dataGetter
    };
  }

}
