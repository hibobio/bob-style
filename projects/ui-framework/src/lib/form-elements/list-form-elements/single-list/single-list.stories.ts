import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { select, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { SingleListModule } from './single-list.module';

const buttonStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Single list">
  <b-single-list style="width: 400px;">
</b-single-list>
`;
const note = `
  ## Single list

  ~~~
  ${ template }
  ~~~
`;
buttonStories.add(
  'Single list', () => ({
    template,
    props: {},
    moduleMetadata: {
      imports: [
        SingleListModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
      ],
    }
  }),
  { notes: { markdown: note } }
);

