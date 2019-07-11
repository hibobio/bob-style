import { storiesOf } from '@storybook/angular';
import { select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { values } from 'lodash';
import { Icons, IconSize, IconColor } from '../../../icons/icons.enum';
import { IconsModule } from '../../../icons/icons.module';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const buttonStories = storiesOf(
  `${ComponentGroupType.ButtonsAndIndicators}.Buttons`,
  module
).addDecorator(withKnobs);

const typeOptions = values(ButtonType);
const iconColor = values(IconColor);
const icons = values(Icons);
const sizeOptions = values(ButtonSize);

const template = `
<b-square-button (clicked)="onClick($event)"
                 [type]="type"
                 [size]="size"
                 [icon]="icon"
                 [color]="color"
                 [disabled]="disabled">
</b-square-button>
`;
const note = `
  ## Square Button Element
  #### Module
  *ButtonsModule*
  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | ButtonType | enum for setting the button type | primary (optional)
  size | ButtonSize | enum for setting the button size | medium (optional)
  icon | Icons | Icon enum value
  color | IconColor | the color of the icon | dark (optional)
  clicked | Function | callback for clicking on the button |
  disabled | boolean | disabled | false

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Square button'">
  <div style="max-width: 400px; margin: 30px auto; display:flex; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>
`;

buttonStories.add(
  'Square Button',
  () => ({
    template: storyTemplate,
    props: {
      type: select('type', typeOptions, ButtonType.secondary),
      size: select('size', sizeOptions, ButtonSize.medium),
      icon: select('icon', icons, Icons.phone_link),
      color: select('color', iconColor, IconColor.dark),
      disabled: boolean('disabled', false),
      onClick: action('Square button')
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule, StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
