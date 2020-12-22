import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { ButtonsModule } from '../buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { IconColor, Icons } from '../../icons/icons.enum';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { select, boolean, text } from '@storybook/addon-knobs';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const template = `
<b-group>
  <b-square-button [type]="active === 0 ? type1 : type2"
                   [size]="size"
                   [icon]="icons.skype_link"
                   [color]="color"
                   [disabled]="disabled"
                   (clicked)="active = 0">
  </b-square-button>
  <b-square-button [type]="active === 1 ? type1 : type2"
                   [size]="size"
                   [icon]="icons.phone_link"
                   [color]="color"
                   [disabled]="disabled"
                   (clicked)="active = 1">
  </b-square-button>
  <b-square-button [type]="active === 2 ? type1 : type2"
                   [size]="size"
                   [icon]="icons.slack_link"
                   [color]="color"
                   [disabled]="disabled"
                   (clicked)="active = 2">
  </b-square-button>
</b-group>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Grouped buttons'">
    ${template}
</b-story-book-layout>
`;

const note = `
  ## Group Element
  #### Module
  *ButtonsModule*

  component for grouping the child components, mainly use for buttons group

  ~~~
  ${template}
  ~~~
`;
story.add(
  'Group',
  () => ({
    template: storyTemplate,
    props: {
      icons: Icons,
      buttonType: ButtonType,
      active: 0,
      type1: select('type 1', Object.values(ButtonType), ButtonType.secondary),
      type2: select('type 2', Object.values(ButtonType), ButtonType.tertiary),
      size: select('size', Object.values(ButtonSize), ButtonSize.medium),
      color: select('color', Object.values(IconColor), IconColor.dark),
      disabled: boolean('disabled', false),
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
