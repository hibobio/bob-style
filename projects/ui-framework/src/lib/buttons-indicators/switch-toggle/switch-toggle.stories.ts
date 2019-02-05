import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { SwitchToggleModule } from './switch-toggle.module';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const buttonStories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Switch toggle">
  <b-switch-toggle [isDisabled]="isDisabled"
                   [isChecked]="isChecked"
                   (changed)="changed($event)">
    Toggle Me!
  </b-switch-toggle>
</b-story-book-layout>
`;
const note = `
  ## Switch toggle element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  isChecked | boolean | is switch toggle on | false
  isDisabled | boolean | is switch toggle disabled | false
  changed | Function | callback for changing the toggle |

  ~~~
  ${ template }
  ~~~
`;
buttonStories.add(
  'Switch toggle', () => ({
    template,
    props: {
      isDisabled: boolean('isDisabled', false),
      isChecked: boolean('isChecked', true),
      changed: action(),
    },
    moduleMetadata: {
      imports: [
        SwitchToggleModule,
        StoryBookLayoutModule,
      ]
    }
  }),
  { notes: { markdown: note } }
);

