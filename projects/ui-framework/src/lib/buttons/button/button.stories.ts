import { action } from '@storybook/addon-actions';
import { boolean, number, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { Icons } from '../../icons/icons.enum';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
// @ts-ignore: md file and not a module
import buttonsProps from '../button.properties.md';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { ButtonsModule } from '../buttons.module';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(withKnobs);

const template = `<b-button
          [type]="type"
          [size]="size"
          [text]="text"
          [disabled]="disabled"
          [active]="active"
          [preloader]="preloader"
          [throttle]="throttle"
          [swallow]="swallow"
          (click)="regClick()"
          (clicked)="onClick($event)">
</b-button>

<a b-button href="javascript:void()"
          [button]="{
            type: type,
            size: size,
            text: text,
            icon: icon,
            disabled: disabled,
            active: active,
            preloader: preloader
          }"
          (clicked)="onClick($event)">
</a>`;

const templForNotes = `<b-button [type]="type"
            [size]="size"
            [text]="text"
            [disabled]="disabled"
            (clicked)="onClick($event)">
      Click me
</b-button>

<a b-button
            [routerLink]="someRoute"
            [button]="{
              type: type,
              text: text,
              icon: icon,
              preloader: preloader
            }">
      Go to profile
</a>`;

const note = `
  ## Button Element
  #### Module
  *ButtonsModule*

  ~~~
  ${templForNotes}
  ~~~

  #### Properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [type] | ButtonType | button type | primary
  [size] | ButtonSize | button size | medium
  [icon] | Icons | button icon | &nbsp;
  [preloader] | Boolean | if true, will hide text and show preloader animation | &nbsp;

  ${buttonsProps}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Button'">
  <style>
    b-button {
      margin: 0 10px;
    }
  </style>
    ${template}
</b-story-book-layout>
`;

story.add(
  'Regular Button',
  () => ({
    template: storyTemplate,
    props: {
      onClick: action('onClick'),
      text: text('text', 'Click me'),
      type: select('type', [0, ...Object.values(ButtonType)], 0),
      size: select('size', [...Object.values(ButtonSize), 0], 0),
      disabled: boolean('disabled', false),
      active: boolean('active', false),
      icon: select('icon', [0, ...Object.values(Icons)], Icons.timeline),
      preloader: boolean('preloader', false),
      throttle: number('throttle', 0),
      swallow: boolean('swallow', false),
      regClick: action('regular (click) binding - if swallow is true, you will not see this'),
    },
    moduleMetadata: {
      imports: [ButtonsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
