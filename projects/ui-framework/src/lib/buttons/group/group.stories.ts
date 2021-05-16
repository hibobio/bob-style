import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { Icons } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { ButtonsModule } from '../buttons.module';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const template = `
<b-group>
  <b-square-button [type]="active === 0 ? type1 : type2"
                   [size]="size"
                   [icon]="icons.skype_link"
                   [disabled]="disabled"
                   (clicked)="active = 0">
  </b-square-button>
  <b-square-button [type]="active === 1 ? type1 : type2"
                   [size]="size"
                   [icon]="icons.phone_link"
                   [disabled]="disabled"
                   (clicked)="active = 1">
  </b-square-button>
  <b-square-button [type]="active === 2 ? type1 : type2"
                   [size]="size"
                   [icon]="icons.slack_link"
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

      disabled: boolean('disabled', false),
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
