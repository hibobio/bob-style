import { storiesOf } from '@storybook/angular';
import {
  select,
  boolean,
  withKnobs,
  text,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { values } from 'lodash';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

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
                 [toolTipSummary]="toolTipSummary"
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
  [type] | ButtonType | enum for setting the button type | primary
  [size] | ButtonSize | enum for setting the button size | medium
  [icon] | Icons | Icon enum value | &nbsp;
  [color] | IconColor | the color of the icon | dark
  [disabled] | boolean | disabled | false
  [toolTipSummary] | string | Tooltip text  | &nbsp;
  (clicked) | EventEmitter | button click event  | &nbsp;

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Square button'">
    ${template}
</b-story-book-layout>
`;

story.add(
  'Square Button',
  () => ({
    template: storyTemplate,
    props: {
      type: select('type', typeOptions, ButtonType.secondary),
      size: select('size', sizeOptions, ButtonSize.medium),
      icon: select('icon', icons, Icons.phone_link),
      color: select('color', iconColor, IconColor.dark),
      toolTipSummary: text('toolTipSummary', 'Call me'),
      disabled: boolean('disabled', false),
      onClick: action('Square button'),
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
