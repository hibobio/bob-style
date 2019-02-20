import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs, number } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { QuickFilterModule } from './quick-filter.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { ButtonSize } from '../../buttons-indicators/buttons/buttons.enum';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const textareaStories = storiesOf(ComponentGroupType.Navigation, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-quick-filter-bar style="width: 95vw; margin: 20px auto;">
  <div bar-prefix>total: 85</div>
  <b-button bar-suffix size="${ButtonSize.small}">more</b-button>
</b-quick-filter-bar>
`;

const storyTemplate = `
<b-story-book-layout title="Textarea">
  ${ template }
</b-story-book-layout>
`;

const note = `
  ## Quick filters

  #### Properties

  Name | Type | Description
  --- | --- | ---

  ~~~
  ${ template }
  ~~~
`;
textareaStories.add(
  'Quick filters',
  () => {
    return {
      template: storyTemplate,
      props: {},
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          QuickFilterModule,
          ButtonsModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
