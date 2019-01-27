import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MiniPreloaderModule } from './mini-preloader.module';

const inputStories = storiesOf(ComponentGroupType.Misc, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `<b-mini-preloader></b-mini-preloader>`;

const note = `
  ## Mini Preloader Element

  #### Properties

  Name | Type | Description
  --- | --- | ---

  ~~~
  ${ template }
  ~~~
`;
inputStories.add(
  'Mini preloader',
  () => {
    return {
      template,
      props: {
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          MiniPreloaderModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
