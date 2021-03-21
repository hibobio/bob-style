import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { boolean, object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { mockAvatar, mockName, mockNames, mockText } from '../../mock.const';
import { MentionsOption } from '../../services/mentions/mentions.service';
import { simpleUID } from '../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CommentsModule } from '../comments.module';

const story = storiesOf(ComponentGroupType.Comments, module).addDecorator(withKnobs);

const mentionsOptions = mockNames(200).map(
  (name: string): MentionsOption => ({
    displayName: name,
    link: 'https://www.google.com/search?q=' + mockText(1),
    avatar: mockAvatar(),
    attributes: {
      'mention-employee-id': simpleUID(),
      class: 'employee-mention',
    },
  })
);

const avatar = mockAvatar();
const name = mockName();

const contentHTML = `Hello! This is a comment with a mention! <span contenteditable="false"><a href="https://www.google.com/search?q=Earum" spellcheck="false" tabindex="-1" mention-employee-id="e6c3f-0194" class="employee-mention" target="_blank" rel="noopener noreferrer">@Laine Ostler</a></span> is the best!`;

const template = `<b-edit-comment
    [comment]="{
      content: mentionsList?.length ? contentHTML : content,
      avatar: avatar,
      name: name
    }"
    [updateOnBlur]="updateOnBlur"
    [placeholder]="placeholder"
    [autoFocus]="autoFocus"
    [mentionsList]="mentionsList"
    (sendComment)="sendComment($event)">
</b-edit-comment>`;

const storyTemplate = `
<b-story-book-layout [title]="'Edit Comment'">
  <div style="max-width: 550px;">
      ${template}
  </div>
</b-story-book-layout>`;

const note = `
  ## EditComment
  #### Module
  *CommentsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | default
  --- | --- | --- | ---
  [comment] | CommentItem | comment data (including .avatar & .content) | &nbsp;
  [updateOnBlur] | boolean | if true - will emit changes on input blur, if false - will emit on Enter key press | false
  [placeholder] | string | placeholder label | &nbsp;
  [autoFocus] | boolean | if true will focus input on init | false
  (sendComment) | EventEmitter<wbr>&lt;CommentItemDto&gt; | emits {content} object on change | &nbsp;
  [mentionsList] | MentionsOption[] | pass an array of \
  { avatar, displayName, link, attributes? } \
  objects for mentions functionality (similar to RTE) | &nbsp;
`;

story.add(
  'Edit Comment',
  () => {
    return {
      template: storyTemplate,
      props: {
        sendComment: action('Send comment click'),

        placeholder: text('placeholder', 'Write your comment here.', 'Props'),
        autoFocus: boolean('autoFocus', true, 'Props'),
        updateOnBlur: boolean('updateOnBlur', false, 'Props'),
        comment: object(
          'comment',
          {
            content: 'First comment!',
            avatar: avatar,
            name: name,
          },
          'Props'
        ),
        mentionsList: object('mentionsList', mentionsOptions, 'Data'),
        contentHTML: contentHTML,
        content: 'First comment!',
        avatar: avatar,
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CommentsModule],
      },
    };
  },
  { notes: { markdown: note } }
);
