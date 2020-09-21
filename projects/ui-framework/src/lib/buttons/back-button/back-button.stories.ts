import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { BackButtonType } from '../buttons.enum';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

// @ts-ignore: md file and not a module
import buttonsProps from '../button.properties.md';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const template = `
<b-back-button [type]="type"
                  [size]="size"
                  [text]="text"
                  [disabled]="disabled"
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
      type: select(
        'type',
        Object.values(BackButtonType),
        BackButtonType.secondary
      ),
      disabled: boolean('disabled', false),
    },
    moduleMetadata: {
      imports: [ButtonsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
