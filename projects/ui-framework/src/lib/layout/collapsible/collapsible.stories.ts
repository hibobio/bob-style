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
import { CollapsibleModule } from './collapsible.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';


const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
<b-collapsible>

      <b-display-3 title>
        I am expansion panel header
      </b-display-3>

  <p card-top>Kyle Wilson</p>
  <p card-bottom>No approvers are required</p>
</b-collapsible>
`;

const storyTemplate = `
<b-story-book-layout title="Single Card">
  <div style="padding: 50px;">
    ${template}
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
  menu | MenuItem[] | array of menu items | none (optional)
  text | string | main text | ''

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Collapsible',
  () => {
    return {
      template: storyTemplate,
      props: {},
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CollapsibleModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
