import { storiesOf } from '@storybook/angular';
import { object, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardTableModule } from './card-table.module';
import { CardTableMockMetaData, CardTableMockData } from './card-table.mock';
import { ComponentGroupType } from '../../consts';
import { RadioButtonModule } from '../../form-elements/radio-button/radio-button.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ChipModule } from '../../chips/chip/chip.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { ChipComponent } from '../../chips/chip/chip.component';
import { ButtonComponent } from '../../buttons/button/button.component';
import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { boolean } from '@storybook/addon-knobs';

const story = storiesOf(ComponentGroupType.Tables, module).addDecorator(
  withKnobs
);

const template = `
<b-card-table-sortable
  [meta]="CardTableMetaData"
  [table]="CardTableData"
  [useDragHandle]="true"
  [disableDragging]="false"
  default="There are no pending requests for your approval"
  (rowClicked)="rowClickHandler($event)"
  (cellClicked)="cellClickHandler($event)"
  (rowOrderChanged)="onRowOrderChange($event)">
</b-card-table-sortable>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Card Table Sortable'" style="background-color: rgb(247,247,247);">
  <style>
    :host ::ng-deep .highlight-second-line span:nth-child(2) {
      color: var(--primary-500);
    }
  </style>

  <div [ngStyle]="{maxWidth: !res ? '840px' : res}">

    <b-card-table-sortable
      [meta]="CardTableMetaData"
      [table]="tableData ? tableData : CardTableData"
      [useDragHandle]="useDragHandle ? useDragHandle : false"
      [disableDragging]="disableDragging ? disableDragging : false"
      default="There are no pending requests for your approval"
      (rowClicked)="rowClickHandler($event)"
      (cellClicked)="cellClickHandler($event)"
      (rowOrderChanged)="onRowOrderChange($event)">
    </b-card-table-sortable>


    <p style="display:flex; justify-content: space-between; align-items: center;\
     max-width: 300px; margin: 40px auto 15px;">
      <span>Width: </span>
      <b-radio-button [radioConfig]="[
          {id: '95%', label: 'auto'},
          {id: '840px', label: '840px'},
          {id: '630px', label: '630px'}
        ]"
        [value]="{id: '840px'}"
        (radioChange)="res = ($event && $event.value) || $event">
      </b-radio-button>
    </p>

    <p style="display:flex; justify-content: space-between; align-items: center; max-width: 300px; margin: 0 auto;">
      <span>Data: </span>
      <b-radio-button [radioConfig]="[
          {id: 1, label: 'original'},
          {id: 2, label: 'empty'}
        ]"
        [value]="{id: 1}"
        (radioChange)="tableData = ($event && $event.value === 2) || ($event === 2) ? [] : CardTableData">
      </b-radio-button>
    </p>

  </div>


</b-story-book-layout>
`;

const note = `
  ## Card Table Sortable

  #### Module
  *CardTableModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [meta] | CardTableCellMeta[] | array of objects, describing table meta-data per column | &nbsp;
  [table] | CardTableCellData[][] | 2-dimentional array (array of arrays)\
   of objects, providing table cell data per row | &nbsp;
  [minCellWidth] | number | number representing minimal cell width in percents | 5
  [useDragHandle] | boolean | allow dragging rows only by using drag handle \
  (icon in the beginning of the row) | false
  [disableDragging] | boolean | turn off/on drag'n'drop functionality. \
  Can be used for viewMode/editMode | false
  [default] | string | text to display if table is empty | 'No data to display'
  (rowClicked) | EventEmitter<wbr>&lt;CardTableRowClickEvent&gt; | row click\
   event transmits: {row: CardTableCellData[], rowIndex: number} | &nbsp;
  (cellClicked) | EventEmitter<wbr>&lt;CardTableCellClickEvent&gt; | cell click\
   event transmits: {cell: CardTableCellData, cellIndex: number, rowIndex: number} | &nbsp;
  (rowOrderChanged) | EventEmitter<wbr>&lt;CardTableRowOrderChangeEvent&gt; | row order change (on drop)\
   event transmits: {previousIndex: number, currentIndex: number} | &nbsp;

  #### \`meta[0]\`: CardTableCellMeta - single column meta-data object properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  id | string / number | unique column id | &nbsp;
  name | string | column title | &nbsp;
  width | number | number representing percentage - to set column width\
   (if not provided, column width will be set automatically) | &nbsp;
  align | string ('left' or undefined / 'right') | text alignment in column | undefined
  textStyle | cardTableAllowedTextStyles | object with text-related CSS \
   properties (camelCase), to be applied on the cell (color, fontWeight, fontSize) | &nbsp;
  sortable | boolean | to enable sorting by column | false

  ##### [meta] example

  \`\`\`
[
  {
    id: 1,
    name: 'Requested For'
  },
  {
    id: 2,
    name: 'Subject',
    textStyle: {
      fontWeight: '500'
    }
  },
  {
    id: 3,
    name: 'Status',
    width: 15,
    align: 'right',
    sortable: true
  }
]
  \`\`\`

  #### \`table[0][0]\`: CardTableCellData - single cell data object properties
  Name | Type | Description
  --- | --- | ---
  data | string | if string is provided, it is treated as text with automatic truncating after 2 lines
   - | string[] | if an array of strings is provided - each string is\
    displayed as separate line, truncated if it doesnt fit the width
   - | RenderedComponent | object describing a Component to be displayed in the cell
    - | empty or absent | if the cell object doesnt have a data property\
     or its value is an empty string, then a '-' will be displayed
  class | string / string[] | class name(s) to be added to the cell

  *Note:* If using RenderedComponent as cell data, consumer must
   declare the component to be used in entryComponents section in the module

  ##### [data] example

  \`\`\`

  [
    [
      {
        data: {
          component: AvatarComponent,
          attributes: {
            imageSource: 'http://i.pravatar.cc/200?img=3',
            title: 'Dylan Herrera',
            subtitle: 'Product designer'
          },
          handlers: {
            clicked: event => {
              console.log('Avatar clicked');
            }
          }
        }
      },
      {
        data: 'UK Product Team Salary Change'
      },
      {
        data: ['Elsie Hunter', '11/03/2019']
      },
      {
        data: ['Madge Scott', '(You)'],
        class: 'highlight-second-line'
      },
      {
        data: {
          component: ButtonComponent,
          attributes: {
            type: 'secondary'
          },
          content: 'Approve',
          handlers: {
            clicked: event => {
              console.log('Button clicked');
            }
          }
        }
      }
    ],
  ]

  \`\`\`


  #### \`table[0][0].component\`: RenderedComponent - properties of object describing Component passed to cell

  please see <u>Services / Component Renderer</u> story

`;

story.add(
  'Card Table Sortable',
  () => {
    return {
      template: storyTemplate,
      props: {
        useDragHandle: boolean('useDragHandle', false),
        disableDragging: boolean('disableDragging', false),
        CardTableMetaData: object('meta', CardTableMockMetaData),
        CardTableData: object('table', CardTableMockData),

        rowClickHandler: action('Row clicked'),
        cellClickHandler: action('Cell clicked'),
        onRowOrderChange: action('Row order changed'),
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          RadioButtonModule,
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardTableModule,
          ChipModule,
          ButtonsModule,
          AvatarModule,
        ],
        entryComponents: [ChipComponent, ButtonComponent, AvatarComponent],
      },
    };
  },
  { notes: { markdown: note } }
);
