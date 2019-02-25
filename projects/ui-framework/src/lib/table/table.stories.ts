import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
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

const tableStories = storiesOf(ComponentGroupType.DataTable, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-table
  [rowData]="rowData"
  [columnDefs]="columnDefs"
  [rowSelection]="rowSelection"
  [rowHeight]="rowHeight"
  [sizeColumnsToFit]="sizeColumnsToFit"
  (rowClicked)="rowClicked($event)"
  (rowSelected)="rowSelected($event)"
  (sortChanged)="sortChanged($event)">
</b-table>
`;

const storyTemplate = `
<b-story-book-layout title="Data Table">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Auto complete Element

  #### Properties
  Name | Type | Description
  --- | --- | ---
  rowData | json | Table data
  columnDefs | json | Columns definition
  rowSelection | boolean | Make headers sticky
  rowHeight | number | The height of the row
  rowSelection | RowSelection | Single or multiple
  rowClicked | Event | Row clicked event
  rowSelected | Function | Row selected event
  sortChanged | Function | Sort changed event

  ~~~
  ${template}
  ~~~
`;
tableStories.add(
  'Data Table',
  () => {
    return {
      template: storyTemplate,
      props: {
        rowData: object('rowData', mockRowData),
        columnDefs: object('columnDefs', mockColumnsDefs),
        rowHeight: number('rowHeight', 50),
        rowSelection: object('rowSelection', RowSelection.Multiple),
        sizeColumnsToFit: boolean('sizeColumnsToFit', false),
        rowClicked: action(),
        rowSelected: action(),
        sortChanged: action(),
      },
      moduleMetadata: {
        entryComponents: [AvatarCellComponent],
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          TableModule,
          AgGridModule,
          AvatarModule,
          AgGridModule.withComponents([AvatarCellComponent])],
      }
    };
  },
  { notes: { markdown: note } }
);
