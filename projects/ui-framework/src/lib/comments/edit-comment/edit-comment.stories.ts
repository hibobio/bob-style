import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import {
  boolean,
  object,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { Types } from '../../enums';
import { mockAvatar, mockName, mockNames, mockText } from '../../mock.const';
import { MentionsOption } from '../../services/mentions/mentions.service';
import { simpleUID } from '../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { HTML_COMMENT_TEXT } from '../comments.mocks';
import { CommentsModule } from '../comments.module';

const story = storiesOf(ComponentGroupType.Comments, module).addDecorator(
  withKnobs
);

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

const template = `<b-edit-comment
    [type]="type"
    [comment]="mentionsList?.length && type !== 'secondary' ? {
      content: contentHTML,
      avatar: avatar,
      name: name1,
      id: id1
    } : {
      content: content,
      avatar: avatar,
      name: name,
      id: id2
    }"
    [updateOnBlur]="updateOnBlur"
    [placeholder]="placeholder"
    [autoFocus]="autoFocus"
    [mentionsList]="type !== 'secondary' && mentionsList"
    [showEmoji]="showEmoji"
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
<b-edit-comment
    [type]="type"
    [comment]="comment"
    [placeholder]="placeholder"
    [autoFocus]="autoFocus"
    [showEmoji]="showEmoji"
    [updateOnBlur]="updateOnBlur"
    [mentionsList]="mentionsList"
    (sendComment)="sendComment($event)">
</b-edit-comment>
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
        type: select(
          'type',
          Object.values(Types).slice(0, 2),
          Types.primary,
          'Props'
        ),

        contentHTML: HTML_COMMENT_TEXT,
        sendComment: action('Send comment click'),
        content: text('content', 'First comment!', 'Props'),
        name: text('name', name, 'Props'),
        avatar: text('avatar', avatar, 'Props'),

        placeholder: text('placeholder', 'Write your comment here', 'Props'),
        autoFocus: boolean('autoFocus', true, 'Props'),
        updateOnBlur: boolean('updateOnBlur', false, 'Props'),
        showEmoji: boolean('showEmoji', true, 'Props'),

        mentionsList: object('mentionsList', mentionsOptions, 'Data'),

        id1: simpleUID(),
        id2: simpleUID(),
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CommentsModule,
        ],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
