import { action } from '@storybook/addon-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { Icons } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { LinkColor } from '../../indicators/link/link.enum';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
// @ts-ignore: md file and not a module
import buttonsProps from '../button.properties.md';
import { ButtonType } from '../buttons.enum';
import { ButtonsModule } from '../buttons.module';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const buttonNote = `<b-text-button [type]="type"
               [text]="text"
               [icon]="icon"
               [disabled]="disabled"
               (clicked)="onClick($event)">
      Click
</b-text-button>

<a b-text-button
              [routerLink]="someRoute"
              [button]="{
                type: type,
                 text: text,
                 icon: icon,
                 disabled: disabled
              }">
      Go to profile
</a>`;

const note = `
  ## Text Button Element
  #### Module
  *ButtonsModule*

  ~~~
  ${buttonNote}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | ButtonType |  button type | secondary
  [icon] | Icons | Icon enum value | &nbsp;
  <s>[color]</s> | <s>LinkColor</s> | <s>color of text and icon</s><br> Use [type] to control color | <s>dark</s>

  ${buttonsProps}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Text button'">
  <div class="blk striped" >
    This is normal text

    <b-text-button class="mrg-x-8 icon-right" [type]="type"
                [text]="text"
                [color]="color"
                [disabled]="disabled"
                (clicked)="onClick($event)">
    </b-text-button>

    then some text and

    <a b-text-button class="mrg-x-8 icon-right" href="javascript:void()"
                [button]="{
                  type: type,
                  text: 'Click there',
                  icon: icon,
                    color: color,
                  disabled: disabled
                }"
                (clicked)="onClick($event)">
    </a>

    and after all

    <span b-text-button class="mrg-x-8"
      [text]="'Click everywhere'"
      [color]="color"
      [disabled]="disabled">
      <b-icon icon="b-icon-graph-timeline" size="small" >
      </b-icon>
    </span>

  </div>
</b-story-book-layout>
`;

story.add(
  'Text Button',
  () => ({
    template: storyTemplate,
    props: {
      text: text('text', 'Click here!'),
      icon: select('icon', [0, ...Object.values(Icons)], Icons.phone_link),
      type: select('type', [0, ...Object.values(ButtonType)], 0),
      color: select('color', Object.values(LinkColor), LinkColor.none),

      disabled: boolean('disabled', false),
      onClick: action('Text button'),
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
