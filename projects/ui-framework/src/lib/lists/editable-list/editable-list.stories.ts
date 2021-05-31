import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { boolean, number, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { editableListMock } from './editable-list.mock';
import { EditableListModule } from './editable-list.module';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate1 = `
<b-editable-list [list]="list$"
                 [sortType]="sortType !== 0 ? sortType : undefined"
                 [allowedActions]="{
                   sort: allowSort,
                   add: allowAdd,
                   remove: allowRemove,
                   order: allowOrder,
                   edit: allowEdit
                 }"
                 [maxChars]="maxChars"
                 (changed)="onListUpdate($event)"
                 (inputChanged)="onInputChange($event)"
                 >
</b-editable-list>
`;

const template = `
<b-story-book-layout [title]="'Editable List'">
  <div>
  ${componentTemplate1}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Editable List

  #### Module
  *EditableListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [list] | SelectOption[] | flat list of SelectOption to edit | []
  [allowedActions] | EditableListActions | what actions are available (sort, add, remove)\
   | EDITABLE-LIST<wbr>-ALLOWED-ACTIONS-DEF (all enabled)
  [sortType] | ListSortType | this input can be used to control sorting from outside \
   (provided sortType will be applied to current list). <br>\
   **Note**:  you don't need to provide [sortType] input to describe list sorting, \
   it checks sorting automatically. | &nbsp;
  [maxChars] | number | Maximum length of text for option input | 100
  (changed) | EventEmitter<wbr>&lt;EditableListState&gt; | emits updated list | &nbsp;
  (inputChanged) | EventEmitter&lt;string&gt; | Outputs input value \
  (for external validation) | &nbsp;


  ~~~
<b-editable-list [list]="list"
                 [sortType]="sortType"
                 [allowedActions]="allowedActions"
                 (changed)="onListUpdate($event)"
                 (inputChanged)="onInputChange($event)>
</b-editable-list>
  ~~~

  #### interface EditableListState
  Name | Type | Description
  --- | --- | ---
  delete | string[] | array of removed items
  create | string[] | array of added items
  sortType | ListSortType | list sorting (Asc/Desc/UserDefined)
  order | string[] | array of item values, representing item order (including new items)
  list | SelectOption[] | current list of {id,value} \
  items (including new items, which will have generated ids that start with 'new-')

`;

const listMock$ = of(editableListMock).pipe(delay(500));

story.add(
  'Editable List',
  () => {
    return {
      template,
      props: {
        list$: editableListMock,

        sortType: select('sortType', [0, 'Asc', 'Desc'], 0, 'Props'),
        maxChars: number('maxChars', 50, {}, 'Props'),
        allowSort: boolean('allowSort', true, 'Props'),
        allowAdd: boolean('allowAdd', true, 'Props'),
        allowRemove: boolean('allowRemove', true, 'Props'),
        allowOrder: boolean('allowOrder', true, 'Props'),
        allowEdit: boolean('allowEdit', true, 'Props'),
        allowActions: select('sortType', [0, 'Asc', 'Desc'], 0, 'Props'),
        onListUpdate: action('onListUpdate'),
        onInputChange: action('onInputChange'),
      },
      moduleMetadata: {
        imports: [
          CommonModule,
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          EditableListModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
