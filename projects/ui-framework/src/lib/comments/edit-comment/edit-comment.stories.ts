import { ComponentGroupType } from '../../consts';
import { storiesOf } from '@storybook/angular';
import { withKnobs, object, text } from '@storybook/addon-knobs/angular';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { action } from '@storybook/addon-actions';
import { CommentsModule } from '../comments.module';
import { mockAvatar, mockNames } from '../../mock.const';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const story = storiesOf(ComponentGroupType.Comments, module).addDecorator(
  withKnobs
);

const template = `
  <b-edit-comment
  [comment]="comment"
  [placeholder]="placeholder"
  (sendComment)="sendComment($event)"></b-edit-comment>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Send comment'">
  <div style="max-width: 550px;">
      ${template}
  </div>
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
  'Edit Comment',
  () => {
    return {
      template: storyTemplate,
      props: {
        sendComment: action('Send comment click'),
        placeholder: text('placeholder', 'Write your comment here.'),
        comment: object('comment', {
          content: 'input value',
          avatar: mockAvatar(),
          name: mockNames(1)
        })
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CommentsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
