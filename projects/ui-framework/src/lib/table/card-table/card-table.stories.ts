import { storiesOf } from '@storybook/angular';
import { object, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import { CardTableModule } from './card-table.module';
import { CardTableMockMetaData, CardTableMockData } from './card-table.mock';

import { ChipModule } from '../../chips/chip/chip.module';
import { ChipComponent } from '../../chips/chip/chip.component';

import { ButtonComponent } from '../../buttons-indicators/buttons/button/button.component';

import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';

import { RadioButtonModule } from '../../form-elements/radio-button/radio-button.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';

const story = storiesOf(ComponentGroupType.Tables, module).addDecorator(
  withKnobs
);

const template = `
<b-card-table
  [meta]="CardTableMetaData"
  [table]="CardTableData"
  default="There are no pending requests for your approval"
  (rowClicked)="rowClickHandler($event)"
  (cellClicked)="cellClickHandler($event)">
</b-card-table>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Card Table'">
  <style>
    :host ::ng-deep .highlight-second-line span:nth-child(2) {
      color: var(--primary-500);
    }
  </style>
  <div style="min-width:100%; min-height: 100%; padding: 20px; background: rgb(247,247,247);">
  <div style="margin: 50px auto;" [ngStyle]="{maxWidth: !res ? '840px' : res}">

    <b-card-table
      [meta]="CardTableMetaData"
      [table]="tableData ? tableData : CardTableData"
      default="There are no pending requests for your approval"
      (rowClicked)="rowClickHandler($event)"
      (cellClicked)="cellClickHandler($event)">
    </b-card-table>


    <p style="display:flex; justify-content: space-between; align-items: center; max-width: 300px; margin: 40px auto 15px;">
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

    <p style="display:flex; justify-content: space-between; align-items: center; max-width: 300px; margin: auto;">
      <span>Data: </span>
      <b-radio-button [radioConfig]="[
          {id: 1, label: 'original'},
          {id: 2, label: 'empty'}
        ]"
        [value]="{id: 1}"
        (radioChange)="tableData = ($event && $event.value === 2) || ($event === 2) ? [] : CardTableData">
      </b-radio-button>
    </p>
    <b-stats></b-stats>
  </div>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Card Table

  #### Module
  *CardTableModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  meta | CardTableCellMeta[] | array of objects, describing table meta-data per column | none
  table | CardTableCellData[][] | 2-dimentional array (array of arrays) of objects, providing table cell data per row | none
  minCellWidth | number | number representing minimal cell width in percents | 5
  default | string | text to display if table is empty | 'No data to display'
  rowClicked | Function | row click handler (event transmits: {row: CardTableCellData[], rowIndex: number}) | none
  cellClicked | Function | cell click handler (event transmits: {cell: CardTableCellData, cellIndex: number, rowIndex: number}) | none

  #### \`meta[0]\`: CardTableCellMeta - single column meta-data object properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  id | string / number | unique column id | none (optional)
  name | string | column title | none
  width | number | number representing percentage - to set column width (if not provided, column width will be set automatically) | none (optional)
  align | string ('left' or undefined / 'right') | text alignment in column | undefined (optional)
  textStyle | cardTableAllowedTextStyles | object with text-related CSS properties (camelCase), to be applied on the cell (color, fontWeight, fontSize) | none (optional)
  sortable | boolean | to enable sorting by column | false (optional)

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
   - | string[] | if an array of strings is provided - each string is displayed as separate line, truncated if it doesnt fit the width
   - | RenderedComponent | object describing a Component to be displayed in the cell
    - | empty or absent | if the cell object doesnt have a data property or its value is an empty string, then a '-' will be displayed
  class | string / string[] | class name(s) to be added to the cell (optional)

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
  'Card Table',
  () => {
    return {
      template: storyTemplate,
      props: {
        CardTableMetaData: object('meta', CardTableMockMetaData),
        CardTableData: object('table', CardTableMockData),

        rowClickHandler: action('Row clicked'),
        cellClickHandler: action('Cell clicked')
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
          UtilComponentsModule
        ],
        entryComponents: [ChipComponent, ButtonComponent, AvatarComponent]
      }
    };
  },
  { notes: { markdown: note } }
);
