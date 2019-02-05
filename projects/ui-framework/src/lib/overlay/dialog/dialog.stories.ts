import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { select, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { ButtonsModule } from '../../buttons-indicators/buttons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from './dialog.module';
import { DialogExampleModule } from './dialog-example.module';

const buttonStories = storiesOf(ComponentGroupType.Overlay, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
  <b-dialog-example></b-dialog-example>
`;
const note = `
  ## Dialog example

  ~~~
  ${ template }
  ~~~
`;
buttonStories.add(
  'Dialog example', () => ({
    template,
    props: {},
    moduleMetadata: {
      imports: [
        DialogModule,
        ButtonsModule,
        BrowserAnimationsModule,
        DialogExampleModule,
      ],
    }
  }),
  { notes: { markdown: note } }
);

