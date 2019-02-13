import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { select, withKnobs, object, text, number, boolean } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { SingleListModule } from './single-list.module';
import { SelectGroupOption } from '../list.interface';

const buttonStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-single-list style="width: 400px;"
               [options]="options"
               [value]="value"
               (selectChange)="selectChange($event)"
               [showSingleGroupHeader]="showSingleGroupHeader">
</b-single-list>
`;

const storyTemplate = `
<b-story-book-layout title="Single list">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Single list

  #### Properties

  Name | Type | Description
  --- | --- | ---
  options | SelectGroupOption[] | model of selection group
  value | (string or number) | selected id
  selectChange | action | returns selected id
  showSingleGroupHeader | boolean | displays single group with group header

  ~~~
  ${ template }
  ~~~
`;

const optionsMock: SelectGroupOption[] = Array.from(Array(4), (_, i) => {
  return {
    groupName: `Basic Info G${ i } - header`,
    options: Array.from(Array(4), (_, k) => {
      return {
        value: `Basic Info G${ i }_E${ k } - option`,
        id: (i * 4) + k,
      };
    }),
  };
});

buttonStories.add(
  'Single list', () => ({
    template: storyTemplate,
    props: {
      selectChange: action(),
      options: object<SelectGroupOption>('options', optionsMock),
      value: text('value', 1),
      showSingleGroupHeader: boolean('showSingleGroupHeader', false),
    },
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

