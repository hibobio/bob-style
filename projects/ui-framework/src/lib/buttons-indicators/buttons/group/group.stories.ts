import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { ButtonsModule } from '../buttons.module';
import { IconsModule } from '../../../icons/icons.module';
import { ButtonType } from '../buttons.enum';
import { Icons } from '../../../icons/icons.enum';
import { values } from 'lodash';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const buttonStories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Grouped buttons">
  <b-group>
    <b-square-button type="${ ButtonType.secondary }"
                     icon="${ Icons.skype_link }">
    </b-square-button>
    <b-square-button type="${ ButtonType.secondary }"
                     icon="${ Icons.phone_link }">
    </b-square-button>
    <b-square-button type="${ ButtonType.secondary }"
                     icon="${ Icons.slack_link }">
    </b-square-button>
  </b-group>
</b-story-book-layout>  
`;
const note = `
  ## Group Element

  component for grouping the child components, mainly use for buttons group
  ~~~
  ${ template }
  ~~~
`;
buttonStories.add(
  'Group', () => ({
    template,
    props: {},
    moduleMetadata: {
      imports: [
        ButtonsModule,
        IconsModule,
        StoryBookLayoutModule,
      ]
    }
  }),
  { notes: { markdown: note } }
);

