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
  someComments,
} from '../comments.mocks';
import { CommentsModule } from '../comments.module';
import { CommentListComponent } from './comment-list.component';

const story = storiesOf(ComponentGroupType.Comments, module).addDecorator(
  withKnobs
);

const template = ` <b-comment-list [comments]="comments"></b-comment-list>`;

const storyTemplate = `
<b-story-book-layout [title]="'Comment List'">
  <div>
   ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Comment List
  #### Module
  *CommentListModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | default
  --- | --- | --- | ---
  [comments] | CommentItem[] | comments data (including .avatar & .content) | &nbsp;

`;

story.add(
  'Comment List',
  () => {
    return {
      template: storyTemplate,
      props: {
        cmnt1: object('1st comment', COMMENT_ITEM),

        comments: [
          COMMENT_ITEM,
          LONG_COMMENT_ITEM,
          HTML_COMMENT,
          ...someComments,
        ],
      },
      moduleMetadata: {
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
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: {
      timestamps: true,
      escapeHTML: false,
    },
  }
);
