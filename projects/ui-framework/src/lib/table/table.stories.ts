import { storiesOf } from '@storybook/angular';
import { boolean, number, object, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';
import { TableModule } from './table.module';
import { AvatarModule } from '../buttons-indicators/avatar/avatar.module';
import { mockColumnsDefs, mockRowData } from './table.mock';
import { AvatarCellComponent } from './table/avatar.component';
import { AgGridModule } from 'ag-grid-angular';
import { RowSelection } from './table/table.interface';

const tableStories = storiesOf(ComponentGroupType.DataTable, module).addDecorator(withKnobs);

const template = `
<b-table style="width: calc(100% - 40px); margin: 0 auto;"
         [rowData]="rowData"
         [columnDefs]="columnDefs"
         [rowSelection]="rowSelection"
         (rowClicked)="rowClicked($event)"
         (rowSelected)="rowSelected($event)"
         (sortChanged)="sortChanged($event)">
</b-table>
`;

const storyTemplate = `
<b-story-book-layout title="Data Table">
  ${ template }
</b-story-book-layout>
`;

const rowSelection = values(RowSelection);

const note = `
  ## Auto complete Element
  #### Module
  *TableModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  rowData | json | Table data
  columnDefs | json | Columns definition
  rowSelection | RowSelection | Single or multiple
  rowClicked | Event | Row clicked event
  rowSelected | Function | Row selected event
  sortChanged | Function | Sort changed event

  ~~~
  ${ template }
  ~~~
`;
tableStories.add(
  'Data Table',
  () => {
    return {
      template: storyTemplate,
      props: {
        rowSelection: select('rowSelection', rowSelection, RowSelection.Multiple),
        rowData: object('rowData', mockRowData),
        columnDefs: object('columnDefs', mockColumnsDefs),
        rowClicked: action('rowClicked'),
        rowSelected: action('rowSelected'),
        sortChanged: action('sortChanged'),
      },
      moduleMetadata: {
        entryComponents: [AvatarCellComponent],
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          TableModule,
          AgGridModule,
          AvatarModule,
          AgGridModule.withComponents([AvatarCellComponent])
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
