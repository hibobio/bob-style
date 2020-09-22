import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ButtonType, ButtonSize } from '../buttons.enum';

// @ts-ignore: md file and not a module
import buttonsProps from '../button.properties.md';
import { Icons } from '../../icons/icons.enum';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const button = `<b-chevron-button [type]="type"
                    [text]="text"
                    [size]="size"
                    [active]="active"
                    [disabled]="disabled"
                    (clicked)="onClick($event)">
</b-chevron-button>`;

const note = `
  ## Chevron button
  #### Module
  *ButtonsModule*

  ~~~
  ${button}
  ~~~

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | ButtonType | button type | primary
  [size] | ButtonSize | button size | medium
  [active] | boolean | changes chevron down / up | false

  ${buttonsProps}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chevron button'">
    <b-chevron-button
          [button]="{
            type: type,
            size: size,
            text: text,
            icon: icon,
            disabled: disabled,
            active: active,
            preloader: preloader
          }"
        (clicked)="onClick($event)"></b-chevron-button>
</b-story-book-layout>
`;

story.add(
  'Chevron Button',
  () => ({
    template: storyTemplate,
    props: {
      text: text('text', 'Jump to section'),
      type: select('type', [0, ...Object.values(ButtonType)], 0),
      size: select('size', [...Object.values(ButtonSize), 0], 0),
      active: boolean('active', false),
      disabled: boolean('disabled', false),
      onClick: action('chevron button clicked'),
      icon: select('icon', [0, ...Object.values(Icons)], 0),
      preloader: boolean('preloader', false),
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
