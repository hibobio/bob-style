import { storiesOf } from '@storybook/angular';
import {
  array,
  boolean,
  number,
  object,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import { CardTableModule } from './card-table.module';
import { CardTableMockMetaData, CardTableMockData } from './cardTableMockData';

import { ChipsModule } from '../../buttons-indicators/chips/chips.module';
import { ChipComponent } from '../../buttons-indicators/chips/chip/chip.component';

import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { ButtonComponent } from '../../buttons-indicators/buttons/button/button.component';

import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';

import { MockComponent } from '../../services/mock-component/mock.component';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
<b-card-table [meta]="CardTableMetaData" [table]="CardTableData">
</b-card-table>
`;

const storyTemplate = `
<b-story-book-layout title="Card Table">
  <div style="padding: 50px;">
    ${template}
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
  meta | CardTableMetaData | array of objects, describing table meta-data per column | none
  table | CardTableData | 2-dimentional array (array of arrays) of objects, providing table cell data per row | none
  minCellWidth | number | number representing minimal cell width in percents | 5

  #### \`meta[0]\`: CardTableCellMeta - single column meta-data object properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  id | string / number | unique column id | none (optional)
  name | string | column title | none
  width | number | number representing percentage - to set column width (if not provided, column width will be set automatically) | none (optional)
  align | string ('left' or undefined / 'right') | text alignment in column | undefined (optional)
  textStyle | cardTableAllowedTextStyles | object with text-related CSS properties (camelCase), to be applied on the cell (color, fontWeight, fontSize) | none (optional)
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
   - | string[] | if an array of strings is provided - each string is displayed as separate line, truncated if it doesnt fit the width
   - | RenderedComponent | object describing a Component to be displayed in the cell

  ##### [data] example

  \`\`\`

  [
    [
      {
        data: {
          component: MockComponent,
          content: [
            {
              component: AvatarComponent,
              attributes: {
                imageSource: 'http://i.pravatar.cc/200?img=3',
              },
              handlers: {
                clicked: event => {
                  console.log('Avatar clicked');
                }
              }
            },
            'Dylan Herrera',
            'Product designer'
          ]
        }
      },
      {
        data: 'UK Product Team Salary Change'
      },
      {
        data: ['Elsie Hunter', '11/03/2019']
      },
      {
        data: ['Madge Scott', '(You)']
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
        CardTableData: object('table', CardTableMockData)
      },
      moduleMetadata: {
        declarations: [MockComponent],
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardTableModule,
          ChipsModule,
          ButtonsModule,
          AvatarModule
        ],
        entryComponents: [
          ChipComponent,
          ButtonComponent,
          AvatarComponent,
          MockComponent
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
