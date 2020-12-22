import { moduleMetadata, storiesOf } from '@storybook/angular';
// @ts-ignore
import * as readme from './README.md';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { COMMENT_ITEM, LONG_COMMENT_ITEM } from '../comments.mocks';
import { CommentsModule } from '../comments.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const story = storiesOf(ComponentGroupType.Comments, module).addDecorator(
  withKnobs
);

const storyTemplate = `
<b-story-book-layout [title]="'Comment List'">
  <div>
    <b-comment-list [comments]="comments"></b-comment-list>
  </div>
</b-story-book-layout>
`;

story
  .addDecorator(
    moduleMetadata({
      declarations: [],
      imports: [StoryBookLayoutModule, BrowserAnimationsModule, CommentsModule],
      providers: [],
      schemas: [],
    })
  )
  .add(
    'Comment list',
    () => ({
      template: storyTemplate,
      props: {
        comments: object('comments', [
          COMMENT_ITEM,
          LONG_COMMENT_ITEM,
          COMMENT_ITEM,
        ]),
      },
    }),
    {
      notes: {
        markdown: readme.default,
        markdownOptions: {
          breaks: true,
        },
      },
    }
  );
