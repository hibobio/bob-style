import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { select, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { SingleSelectModule } from './single-select.module';

const buttonStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Single select 2">
  <b-single-select style="width: 400px;">
</b-single-select>
`;
const note = `
  ## Single Select 2

  ~~~
  ${ template }
  ~~~
`;
buttonStories.add(
  'Single select 2', () => ({
    template,
    props: {},
    moduleMetadata: {
      imports: [
        SingleSelectModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
      ],
    }
  }),
  { notes: { markdown: note } }
);

