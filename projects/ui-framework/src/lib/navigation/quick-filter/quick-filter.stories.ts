import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs, number, object } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { QuickFilterModule } from './quick-filter.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { ButtonSize } from '../../buttons-indicators/buttons/buttons.enum';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuickFilterSelectType } from './quick-filter.enum';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';

const textareaStories = storiesOf(ComponentGroupType.Navigation, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-quick-filter-bar style="width: 95vw; margin: 20px auto;"
                    [quickFilters]="quickFilters">
  <div bar-prefix>total: 85</div>
  <b-button bar-suffix size="${ ButtonSize.small }">more</b-button>
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

const optionsMock: SelectGroupOption[] = Array.from(Array(3), (_, i) => {
  return {
    groupName: `Basic Info G${ i } - header`,
    options: Array.from(Array(4), (_, k) => {
      return {
        value: `Basic Info G${ i }_E${ k } - option`,
        id: i * 4 + k,
      };
    })
  };
});

const quickFilters = [
  {
    selectType: QuickFilterSelectType.multiSelect,
    label: 'department',
    options: [optionsMock[0]],
    value: [1, 2],
  },
  {
    selectType: QuickFilterSelectType.multiSelect,
    label: 'site',
    options: optionsMock,
    value: [],
  },
  {
    selectType: QuickFilterSelectType.singleSelect,
    label: 'employment',
    options: [optionsMock[0]],
    value: null,
  },
];


textareaStories.add(
  'Quick filters',
  () => {
    return {
      template: storyTemplate,
      props: {
        quickFilters: object('quickFilters', quickFilters)
      },
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
