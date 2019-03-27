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
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { CollapsibleModule } from './collapsible.module';
import { CollapsibleType } from './collapsible.enum';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
  <b-collapsible
    [type]="type"
    [expanded]="expanded"
    [disabled]="disabled"
    [title]="title"
    [description]="description"
    (closed)="onPanelClosed($event)"
    (opened)="onPanelOpened($event)">

    <b-button suffix size="medium" type="secondary">
      Preview
    </b-button>

    {{ content.repeat(10) }}

  </b-collapsible>
`;

const storyTemplate = `
<b-story-book-layout title="Collapsible">
  <div style="padding: 50px; overflow: hidden;">
    ${template.repeat(5)}
</div>
</b-story-book-layout>
`;

const note = `
  ## Collapsible panel

  #### Module
  *CollapsibleModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | CollapsibleType | ennum to set panel type (small or big) | small
  expanded | boolean | if the panel is open | false
  disabled | boolean | if the panel is disabled (can't be opened) | false
  title | panel header title | title | ''
  description | string | panel header description | none (optional)

  Content marked with [suffix] will be projected into the right part of the panel header.


  #### Events
  Name | Description
  --- | ---
  opened | Emitted every time the panel is opened
  closed | Emitted every time the panel is closed

  ~~~
  ${template}
  ~~~
`;

const typeOptions = values(CollapsibleType);

const contentMock =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin lectus sit amet feugiat tempor. Phasellus non faucibus orci. Aliquam risus nisi, ultrices nec sapien ut, tempus egestas ante. Maecenas fermentum massa odio, ac venenatis ipsum ultrices eu. Nam malesuada, dolor sit amet finibus luctus, purus ex volutpat lorem, eget laoreet metus tellus et nibh. ';

story.add(
  'Collapsible',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', typeOptions, CollapsibleType.small),
        expanded: boolean('expanded', false),
        disabled: boolean('disabled', false),
        title: text('title', 'Other People’s requests (4):'),
        description: text(
          'description',
          'Here you could see the manager side details'
        ),
        content: text('content', contentMock),

        onPanelOpened: action('Panel opened'),
        onPanelClosed: action('Panel closed')
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CollapsibleModule,
          ButtonsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
