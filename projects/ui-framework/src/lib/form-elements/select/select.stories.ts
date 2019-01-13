import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { SelectModule } from './select.module';

const selectStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
  <b-select>
 </b-select>
`;

const note = `
  ## Select Element

  #### Properties

  Name | Type | Description
  --- | --- | ---

  ~~~
  ${ template }
  ~~~
`;
selectStories.add(
  'Select',
  () => {
    return {
      template,
      props: {},
      moduleMetadata: {
        imports: [
          SelectModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
