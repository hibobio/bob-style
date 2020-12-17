import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { MetaTooltipModule } from './meta-tooltip.module';

const story = storiesOf(ComponentGroupType.Tooltip, module).addDecorator(
  withKnobs
);

const template = `

<p [bTooltip]="'Some text'"> This has tooltip </p>

<p [bTooltip]="{text:'Some text'}"> This has tooltip </p>

`;

const storyTemplate = `<b-story-book-layout [title]="'Meta Tooltip'">
  <div style="max-width: none; text-align: left; display: flex; justify-content: space-evenly;">
    ${template}
  </div>
</b-story-book-layout>`;

const note = `
  ## Meta Tooltip

  #### Module
  *MetaTooltipModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---


`;
story.add(
  'Meta Tooltip',
  () => ({
    template: storyTemplate,
    props: {},
    moduleMetadata: {
      imports: [
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        MetaTooltipModule,
      ],
    },
  }),
  { notes: { markdown: note } }
);
