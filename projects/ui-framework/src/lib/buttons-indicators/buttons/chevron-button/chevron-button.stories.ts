import { storiesOf } from '@storybook/angular';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { values } from 'lodash';
import { IconsModule } from '../../../icons/icons.module';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const buttonStories = storiesOf(
  `${ ComponentGroupType.ButtonsAndIndicators }.Buttons`,
  module
).addDecorator(withKnobs);

const button = `
<b-chevron-button (clicked)="onClick($event)"
                 [text]="text"
                 [active]="active">
</b-chevron-button>
`;

const note = `
  ## Chevron button
  #### Module
  *ButtonsModule*
  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  text | text | Button text | none
  active | boolean | changes chevron down / up | false
  clicked | Function | callback for clicking on the button |

  ~~~
  ${ button }
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chevron button'">
    ${ button }
</b-story-book-layout>
`;

buttonStories.add(
  'Chevron Button',
  () => ({
    template: storyTemplate,
    props: {
      text: text('text', 'Jump to section'),
      active: boolean('active', false),
      onClick: action('chevron button clicked')
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule, StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
