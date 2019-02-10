import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { select, withKnobs, object, array } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { MultiListModule } from './multi-list.module';
import { SelectGroupOption } from '../../select';

const buttonStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Single list">
  <b-multi-list style="width: 400px;"
                [options]="options"
                [value]="value">
  </b-multi-list>
</b-story-book-layout>
`;
const note = `
  ## Multi list

  ~~~
  ${ template }
  ~~~
`;

const optionsMock = Array.from(Array(4), (_, i) => {
  return {
    groupName: `Basic Info G${ i }`,
    options: Array.from(Array(4), (_, k) => {
      return {
        value: `Basic Info G${ i }_E${ k }`,
        id: (i * 4) + k,
      };
    }),
  };
});

buttonStories.add(
  'Multi list', () => ({
    template,
    props: {
      options: object<SelectGroupOption>('options', optionsMock),
      value: array('value', [1, 3, 6, 8, 9, 10, 11]),
    },
    moduleMetadata: {
      imports: [
        MultiListModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
      ],
    }
  }),
  { notes: { markdown: note } }
);

