import { storiesOf } from '@storybook/angular';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { SwitchToggleModule } from './switch-toggle.module';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const buttonStories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module).addDecorator(withKnobs);

const template = `
<b-switch-toggle [isDisabled]="isDisabled"
                 [isChecked]="isChecked"
                 (switchChange)="switchChange($event)">
  Toggle me!
</b-switch-toggle>
`;
const note = `
  ## Switch toggle element
  #### Module
  *SwitchToggleModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  isChecked | boolean | is switch toggle on | false
  isDisabled | boolean | is switch toggle disabled | false
  changed | Function | callback for changing the toggle |

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Switch toggle'">
  <div style="max-width: 400px; margin: 30px auto; display:flex; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>
`;

buttonStories.add(
  'Switch toggle',
  () => ({
    template: storyTemplate,
    props: {
      isDisabled: boolean('isDisabled', false),
      isChecked: boolean('isChecked', true),
      switchChange: action('switchChange')
    },
    moduleMetadata: {
      imports: [SwitchToggleModule, StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
