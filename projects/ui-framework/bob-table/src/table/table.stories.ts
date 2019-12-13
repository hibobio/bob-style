import { storiesOf } from '@storybook/angular';
import {
  number,
  object,
  select,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../../../src/lib/consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../src/lib/story-book-layout/story-book-layout.module';
import { TableModule } from './table.module';
import { AvatarModule } from '../../../src/lib/avatar/avatar/avatar.module';
import { mockColumnsDefs, mockRowData } from './table-mocks/table-story.mock';
import { AvatarCellComponent } from './table-cell-components/avatar-cell/avatar.component';
import { AgGridModule } from 'ag-grid-angular';
import { RowSelection, TableType } from './table/table.enum';
import { ActionsCellComponent } from './table-cell-components/actions-cell/actions-cell.component';

const story = storiesOf(ComponentGroupType.Tables, module).addDecorator(
  withKnobs
);

const template = `
<b-table [type]="type"
         [rowData]="rowData"
         [columnDefs]="columnDefs"
         [maxHeight]="maxHeight"
         [rowSelection]="rowSelection"
         (rowClicked)="rowClicked($event)"
         (selectionChanged)="selectionChanged($event)"
         (sortChanged)="sortChanged($event)">
</b-table>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Data Table'">
  <div style="max-width: calc(100% - 60px);">
    ${template}
  </div>

</b-story-book-layout>
`;

const type = values(TableType);
const rowSelection = values(RowSelection);

const note = `
  ## Auto complete Element

  #### Module
  *TableModule*
  from <u>'bob-style/bob-table'</u>

  \`\`\`
  import { TableModule, TableType, RowSelection, ColumnDef, RowClickedEvent, GridActions } from 'bob-style/bob-table';
  \`\`\`

  #### Properties
  Name | Type | Description | default value
  --- | --- | --- | ---
  type | TableType | table style theme | TableType.primary
  rowData | json | Table data | &nbsp;
  columnDefs | json | Columns definition | &nbsp;
  rowSelection | RowSelection | single multiple | null
  suppressColumnVirtualisation | boolean | disables virtual scroll on columns | true
  maxHeight | number | grid max height | 450
  rowClicked | Event | Row clicked event | &nbsp;
  gridInit | Event | Grid init event | &nbsp;
  selectionChanged | Event | All selected rows | &nbsp;
  sortChanged | Event | Sort changed event | &nbsp;
  tableGridOptions | GridOptions - Partial | extra options that are added on grid | {}
  addRows | Function | add rows | &nbsp;
  updateRows | Function | update rows | &nbsp;
  removeRows | Function | remove rows | &nbsp;
  filterRows | Function | search rows | &nbsp;
  resetFilter | Function | reset filter | &nbsp;
  ~~~
  ${template}
  ~~~
`;
story.add(
  'Data Table',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', type, TableType.Primary),
        maxHeight: number('maxHeight', 450),
        rowSelection: select(
          'rowSelection',
          rowSelection,
          RowSelection.Multiple
        ),
        columnDefs: object('columnDefs', mockColumnsDefs),
        rowData: object('rowData', mockRowData),
        rowClicked: action('Row clicked'),
        selectionChanged: action('Selection changed'),
        sortChanged: action('sort changed'),
      },
      moduleMetadata: {
        entryComponents: [AvatarCellComponent, ActionsCellComponent],
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          TableModule,
          AgGridModule,
          AvatarModule,
          AgGridModule.withComponents([AvatarCellComponent]),
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
