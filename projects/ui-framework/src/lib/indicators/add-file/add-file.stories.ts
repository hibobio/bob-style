import { ComponentGroupType } from '../../consts';
import { storiesOf } from '@storybook/angular';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs';
import { AddFileModule } from './add-file.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { Icons } from '../../icons/icons.enum';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);

const icons = values(Icons);

const template = `
  <b-add-file (clicked)="onClick($event)"
              [icon]="icon"
              [imageUrl]="imageUrl"></b-add-file>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Add File'">
    ${template}
</b-story-book-layout>`;

const note = `
  ## Add File Element
  #### Module
  *AddFileModule*

  #### Properties
  ~~~
  ${template}
  ~~~
`;

story.add(
  'Add File',
  () => {
    return {
      template: storyTemplate,
      props: {
        icon: select('icon', icons, Icons.add_photo),
        imageUrl: select(
          'imageUrl',
          [
            'https://i.imgur.com/LMg0fWt.png',
            'https://www.freeiconspng.com/uploads/skype-icon-5.png',
          ],
          'https://i.imgur.com/LMg0fWt.png'
        ),
        onClick: action('Add file click'),
      },
      moduleMetadata: {
        imports: [AddFileModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
