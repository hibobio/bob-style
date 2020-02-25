import {Directive, Input, OnInit, Host, ComponentFactoryResolver, Injector} from '@angular/core';
import {merge} from 'lodash';
import {TableComponent} from '../table.component';
import {TreeConfig, defaultTreeConfig, TreeCellRendererComponent} from './tree.config';

function getTreeCellRenderer(treeConfig: TreeConfig, cfr: ComponentFactoryResolver) {
  return class TreeCellRenderer {
    private value: any;

    init({value}) {
      this.value = value;
    }

    getGui(): string {
      if (treeConfig.cellComponent) {
        return this.renderComponent();
      } else if (treeConfig.cellTemplate) {
        return this.renderTemplate();
      }
      return this.value;
    }

    private renderComponent() {
      const injector: Injector = Injector.create({providers: []});
      const cmpFactory = cfr.resolveComponentFactory<TreeCellRendererComponent>(treeConfig.cellComponent);
      const cmpRef = cmpFactory.create(injector);
      if (typeof cmpRef.instance.init === 'function') {
        cmpRef.instance.init(this.value);
      }
      cmpRef.changeDetectorRef.detectChanges();
      return (cmpRef.hostView as any).rootNodes[0];
    }

    private renderTemplate() {
      return treeConfig.cellTemplate(this.value);
    }
  };

}


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[treeConfig]'
})
export class TreeDirective implements OnInit {

  public treeConfig: TreeConfig;
  get table() {
    return this.tableComponent.agGrid;
  }

  @Input('treeConfig') set setTreeConfig(treeConfig: TreeConfig) {
    this.treeConfig = merge(defaultTreeConfig, treeConfig);
    this.applyTreeConfig(this.treeConfig);
  }
  @Input() isCollapsable = true;

  constructor(@Host() private tableComponent: TableComponent, private cfr: ComponentFactoryResolver) { }

  public ngOnInit(): void {
    this.tableComponent.addClass('tree-table');
    if (!this.isCollapsable) {
      this.tableComponent.addClass('tree-no-collapse');
    }
  }

  private applyTreeConfig(treeConfig: TreeConfig) {
    this.tableComponent.agGrid.treeData = true;
    this.tableComponent.agGrid.getDataPath = treeConfig.hierarchyGetter;
    this.tableComponent.agGrid.groupDefaultExpanded = treeConfig.groupDefaultExpanded;
    this.tableComponent.agGrid.autoGroupColumnDef = {
      ...treeConfig.colDef,
      cellRendererParams: {
        suppressCount: treeConfig.suppressCount,
        suppressDoubleClickExpand: true,
        suppressEnterExpand: true,
        innerRenderer: getTreeCellRenderer(treeConfig, this.cfr)
      },
      valueGetter: treeConfig.dataGetter
    };
  }

}
