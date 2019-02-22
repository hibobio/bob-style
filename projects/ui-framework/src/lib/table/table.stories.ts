import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { boolean, number, object, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';
import { TableModule } from './table.module';
import { AvatarComponent } from '../buttons-indicators/avatar/avatar.component';
import { AvatarModule } from '../buttons-indicators/avatar/avatar.module';
import { mockColumns, mockData } from './table.mock';

const tableStories = storiesOf(ComponentGroupType.DataTable, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-table
  [data]="data"
  [columns]="columns"
  [stickyHeader]="stickyHeader"
  [stickyColumns]="stickyColumns"
  (select)="select($event)"
  (sort)="sort($event)"
  (rowClick)="rowClick($event)"
  (rowRightClick)="rowRightClick($event)">
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
  data | json | Table data
  columns | json | Table columns
  stickyHeader | boolean | Make headers sticky
  stickyColumns | number | Number of the sticky column
  select | id |  select event
  sort | id | sort event
  rowClick | id | row click event
  rowRightClick | id | right click event

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
        stickyHeader: boolean('stickyHeader', false),
        stickyColumns: number('stickyColumns', -1),
        data: object('data', mockData),
        columns: object('columns', mockColumns),
        select: action(),
        sort: action(),
        rowClick: action(),
        rowRightClick: action()
      },
      moduleMetadata: {
        entryComponents: [AvatarComponent],
        imports: [BrowserAnimationsModule, StoryBookLayoutModule, TableModule, AvatarModule]
      }
    };
  },
  { notes: { markdown: note } }
);
