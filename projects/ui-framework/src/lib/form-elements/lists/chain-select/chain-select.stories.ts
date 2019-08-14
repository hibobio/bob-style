import { storiesOf } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { SingleSelectComponent } from '../single-select/single-select.component';
import { ChainSelectExampleModule } from './chain-select.example';

const buttonStories = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `<b-chain-select-example (selectChange)="selectChange($event)"></b-chain-select-example>`;

const storyTemplate = `
<b-story-book-layout [title]="'Chain select'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Chain select

  #### Module
  *ChainSelectModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  selectComponent | Type | Select component to chain | none
  actionLabel | string | action label text | none
  outputKey | string | key of event emitter in selectComponent | none
  selectChange | action | returns object with listChange and index each time a select in the chain is changed | none
  selectedIds | (string or number)[] | selected values for each selectComponent | none (Optional)
  selectedIdKey | string | key of selected values input in selectComponent | none (Optional)

  ~~~
  ${template}
  ~~~
`;

buttonStories.add(
  'Chain select',
  () => ({
    template: storyTemplate,
    props: {
      selectChange: action('Chain select state')
    },
    moduleMetadata: {
      imports: [StoryBookLayoutModule, ChainSelectExampleModule],
      entryComponents: [SingleSelectComponent]
    }
  }),
  { notes: { markdown: note } }
);
