import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { select, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { ButtonsModule } from '../../buttons-indicators/buttons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from './dialog.module';
import { DialogExampleModule } from './dialog-example.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const buttonStories = storiesOf(ComponentGroupType.Overlay, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Dialog">
  <b-dialog-example></b-dialog-example>
</b-story-book-layout>
`;
const note = `
  ## Dialog

  ~~~
  ${ template }
  ~~~
`;
buttonStories.add(
  'Dialog', () => ({
    template,
    props: {},
    moduleMetadata: {
      imports: [
        DialogModule,
        ButtonsModule,
        BrowserAnimationsModule,
        DialogExampleModule,
        StoryBookLayoutModule,
      ],
    }
  }),
  { notes: { markdown: note } }
);

