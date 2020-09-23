import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AgGridAngular } from 'ag-grid-angular';
import { TableModule } from '../../table.module';
import { TableComponent } from '../table.component';
import { defaultTreeConfig, TreeConfig } from './tree.config';
import { TreeDirective } from './tree.directive';

import { Component, OnInit } from '@angular/core';
import {
  mockTranslatePipe,
  TranslateServiceProvideMock,
} from '../../../../../src/lib/tests/services.stub.spec';

@Component({
  selector: 'b-table-tree-test',
  template: `<b-table [treeConfig]="treeConfig"></b-table>`,
})
export class TableTreeTestComponent implements OnInit {
  public treeConfig;
  constructor() {}

  ngOnInit() {}
}

describe('TreeDirective', () => {
  let fixture: ComponentFixture<TableTreeTestComponent>;
  let component: TableTreeTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableTreeTestComponent, mockTranslatePipe],
      imports: [TableModule],
      providers: [TranslateServiceProvideMock()],
    }).compileComponents();
    fixture = TestBed.createComponent(TableTreeTestComponent);
    component = fixture.componentInstance;
  });

  describe('treeAble', () => {
    let grid: AgGridAngular;
    const defaultConfigMock = {
      ...defaultTreeConfig,
      hierarchyGetter: () => [],
    };
    function setup(treeConfig: TreeConfig = defaultConfigMock) {
      component.treeConfig = treeConfig;
      fixture.detectChanges();
      // tslint:disable-next-line:max-line-length
      const gridElem: TableComponent = fixture.debugElement.query(
        By.css('b-table')
      ).componentInstance;
      grid = gridElem.agGrid;
    }
    it('should pass the treeData', () => {
      setup();
      expect(grid.treeData).toBeTruthy();
    });
    it('should pass getDataPath', () => {
      const getPathMock = (data) => [];
      setup({ ...defaultConfigMock, hierarchyGetter: getPathMock });
      expect(grid.getDataPath).toBe(getPathMock);
    });
    it('should pass groupDefaultExpanded', () => {
      setup();
      expect(grid.groupDefaultExpanded).toBe(
        defaultConfigMock.groupDefaultExpanded
      );
    });
  });
});
