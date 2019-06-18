import { storiesOf } from '@storybook/angular';
import {
  number,
  object,
  select,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';
import { TableModule } from './table.module';
import { AvatarModule } from '../buttons-indicators/avatar/avatar.module';
import { mockColumnsDefs, mockRowData } from './table-mocks/table-story.mock';
import { AvatarCellComponent } from './table-cell-components/avatar.component';
import { AgGridModule } from 'ag-grid-angular';
import { RowSelection, TableType } from './table/table.enum';

const tableStories = storiesOf(ComponentGroupType.Tables, module).addDecorator(
  withKnobs
);

const template = `
<b-table [type]="type"
         [rowData]="rowData"
         [columnDefs]="columnDefs"
         [rowSelection]="rowSelection"
         (rowClicked)="rowClicked($event)"
         (selectionChanged)="selectionChanged($event)"
         (sortChanged)="sortChanged($event)">
</b-table>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Data Table'">
  <div style="width: calc(100% - 60px); margin: 30px auto;">
    ${ template }
  </div>
</b-story-book-layout>
`;

const type = values(TableType);
const rowSelection = values(RowSelection);

const note = `
  ## Auto complete Element
  #### Module
  *TableModule*

  #### Properties
  Name | Type | Description | default value
  --- | --- | --- | ---
  type | TableType | table style theme | TableType.primary
  rowData | json | Table data |
  columnDefs | json | Columns definition |
  rowSelection | RowSelection | single multiple | null
  maxHeight | number | grid max height | 450
  rowClicked | Event | Row clicked event
  selectionChanged | Event | All selected rows
  sortChanged | Event | Sort changed event
  addRows | Function | add rows
  updateRows | Function | update rows
  removeRows | Function | remove rows
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
        type: select('type', type, TableType.Primary),
        maxHeight: number('maxHeight', null),
        rowSelection: select('rowSelection', rowSelection, RowSelection.Multiple),
        rowData: object('rowData', mockRowData),
        columnDefs: object('columnDefs', mockColumnsDefs),
        rowClicked: action('Row clicked'),
        selectionChanged: action('Selection changed'),
        sortChanged: action('sort changed')
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
