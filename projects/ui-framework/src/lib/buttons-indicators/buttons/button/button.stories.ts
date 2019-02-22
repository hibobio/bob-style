import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { ButtonType, ButtonSize } from '../buttons.enum';
import { values } from 'lodash';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const buttonStories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const typeOptions = values(ButtonType);
const sizeOptions = values(ButtonSize);
const template = `
<b-button
  (clicked)="onClick($event)"
  [type]="type"
  [size]="size">
    {{label}}
</b-button>
`;
const note = `
  ## Button Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | ButtonType | enum for setting the button type | primary (optional)
  size | ButtonSize | enum for setting the button size | medium (optional)
  clicked | Function | callback for clicking on the button |

  #### Style customization

  property name | Description
  --- | ---
  primary-color | the color of the primary button
  primary-color-dark | the hover color of the primary button
  primary-color-darker | the pressed color of the primary button

  ~~~
  ${ template }
  ~~~
`;

const storyTemplate = `
<b-story-book-layout title="Button">
  ${ template }
</b-story-book-layout>
`;

buttonStories.add(
  'Regular Button', () => ({
    template: storyTemplate,
    props: {
      onClick: action(),
      label: text('label', 'Click me'),
      type: select('type', typeOptions, ButtonType.primary),
      size: select('size', sizeOptions, ButtonSize.medium),
    },
    moduleMetadata: {
      imports: [
        ButtonsModule,
        StoryBookLayoutModule,
      ],
    }
  }),
  { notes: { markdown: note } }
);

