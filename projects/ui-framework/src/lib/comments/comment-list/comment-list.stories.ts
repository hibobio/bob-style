import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { object, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import {
  COMMENT_ITEM,
  HTML_COMMENT,
  LONG_COMMENT_ITEM,
} from '../comments.mocks';
import { CommentsModule } from '../comments.module';
import { CommentListComponent } from './comment-list.component';
// @ts-ignore
import * as readme from './README.md';

const story = storiesOf(ComponentGroupType.Comments, module).addDecorator(
  withKnobs
);

const storyTemplate = `
<b-story-book-layout [title]="'Comment List'">
  <div>
    <b-comment-list [comments]="[cmnt1,cmnt2,cmnt3]"></b-comment-list>
  </div>
</b-story-book-layout>
`;

story
  .addDecorator(
    moduleMetadata({
      declarations: [],
      imports: [
        StoryBookLayoutModule,
        BrowserAnimationsModule,
        CommentsModule,

        RouterModule.forRoot(
          [
            {
              path: '',
              component: CommentListComponent,
            },
            {
              path: 'employee-profile/:id',
              component: CommentListComponent,
            },
          ],
          { useHash: true }
        ),
      ],
      providers: [],
      schemas: [],
    })
  )
  .add(
    'Comment list',
    () => ({
      template: storyTemplate,
      props: {
        cmnt1: object('1st comment', COMMENT_ITEM),
        cmnt2: LONG_COMMENT_ITEM,
        cmnt3: HTML_COMMENT,
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
