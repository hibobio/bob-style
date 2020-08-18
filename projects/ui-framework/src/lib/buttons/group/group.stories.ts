import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { ButtonsModule } from '../buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { IconColor, Icons } from '../../icons/icons.enum';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { select, boolean, text } from '@storybook/addon-knobs/angular';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const template = `
<b-group>
  <b-square-button [type]="type"
                   [size]="size"
                   [icon]="icons.skype_link"
                   [color]="color"
                   [disabled]="disabled">
  </b-square-button>
  <b-square-button [type]="type"
                   [size]="size"
                   [icon]="icons.phone_link"
                   [color]="color"
                   [disabled]="disabled">
  </b-square-button>
  <b-square-button [type]="type"
                   [size]="size"
                   [icon]="icons.slack_link"
                   [color]="color"
                   [disabled]="disabled">
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
      type: select('type', Object.values(ButtonType), ButtonType.secondary),
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
