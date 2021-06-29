import { action } from '@storybook/addon-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
// @ts-ignore: md file and not a module
import buttonsProps from '../button.properties.md';
import { ButtonType } from '../buttons.enum';
import { ButtonsModule } from '../buttons.module';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const template = `
<b-back-button [type]="type"
                  [size]="size"
                  [text]="text"
                  [disabled]="disabled"
                  [preloader]="preloader"
                  (clicked)="onClick($event)">
</b-back-button>
`;

const templForNotes = `<b-back-button [type]="type"
                 [text]="text"
                 [disabled]="disabled"
                 (clicked)="onClick($event)">
    Back
</b-back-button>`;

const note = `
  ## Back Button Element
  #### Module
  *ButtonsModule*

  ~~~
  ${templForNotes}
  ~~~

  #### Properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [type] | BackButtonType | back button type | secondary

  ${buttonsProps}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Back button'">
    ${template}
</b-story-book-layout>
`;

story.add(
  'Back Button',
  () => ({
    template: storyTemplate,
    props: {
      onClick: action('onClick'),
      text: text('text', 'Back'),
      type: select('type', [0, ...Object.values(ButtonType)], 0),
      disabled: boolean('disabled', false),
      preloader: boolean('preloader', false),
    },
    moduleMetadata: {
      imports: [ButtonsModule, StoryBookLayoutModule],
    },
  }),
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
