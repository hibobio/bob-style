import { storiesOf } from '@storybook/angular';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SingleSelectComponent } from '../single-select/single-select.component';
import {
  ChainSelectExampleModule,
  template as exampleTemplate,
} from './chain-select.example';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-chain-select-example
  [actionLabel]="actionLabel"
  [staticMode]="staticMode"
  (selectChange)="selectChange($event)">
</b-chain-select-example>
`;

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
  selectedItemList | (any)[] | selected values for each select | &nbsp;
  actionLabel | string | action label text | &nbsp;
  staticMode | boolean | when in static mode, the number of select elements is determined by the selectedItemList input\
  and cannot be changed (Add and Delete buttons are hidden) | false
  selectChange | action | EventEmitter - emits ChainSelectEvent | &nbsp;

  ~~~
  ${exampleTemplate}
  ~~~
`;

story.add(
  'Chain select',
  () => ({
    template: storyTemplate,
    props: {
      selectChange: action('Chain select event'),
      actionLabel: text('action label', 'Add another'),
      staticMode: boolean('static mode', false),
    },
    moduleMetadata: {
      imports: [StoryBookLayoutModule, ChainSelectExampleModule],
      entryComponents: [SingleSelectComponent],
    },
  }),
  { notes: { markdown: note } }
);
