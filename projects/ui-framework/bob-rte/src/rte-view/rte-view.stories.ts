import { storiesOf } from '@storybook/angular';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { withKnobs, select } from '@storybook/addon-knobs';
import { StoryBookLayoutModule } from '../../../src/lib/story-book-layout/story-book-layout.module';

import { rteMockHtml, placeholderMock } from '../rte/rte.mocks';
import { ComponentGroupType } from '../../../src/lib/consts';
import { xssMock } from '../../../src/lib/services/utils/xss.mock';

import { RteViewModule } from './rte-view.module';
import { RteViewComponent } from './rte-view.component';
import { RteViewType } from './rte-view.enum';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `<b-rich-text-view [type]="type" [value]="html === 'rich text' ? rteMockHtml : xssTest"
      [placeholderList]="placeholderList"></b-rich-text-view>`;

const storyTemplate = `
<b-story-book-layout [title]="'RTE View'" style="background-color: rgb(245,245,245); text-align: left;">
<div style="width: 100%; max-width: none;">
    ${template}
</div>
</b-story-book-layout>
`;

const note = `
  ## RTE View

  #### Module
  *RteViewModule*

  Use this component to display HTML from Rich Text Editor.<br>
  Can also be used to sanitize any HTML (in place of [innerHTML] binding).

  ~~~
  <b-rich-text-view [value]="html"
                    [type]="type"
                    [placeholderList]="placeholderList">
  </b-rich-text-view>
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  [value] | string | html to display
  [type] | RteViewType | different style presets (check out 'shoutout')
  [placeholderList] | SelectGroupOption[] | options for placeholders

`;

story.add(
  'RTE View',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', Object.values(RteViewType), RteViewType.richText),
        html: select('value', ['rich text', 'xss test'], 'rich text'),
        rteMockHtml: rteMockHtml,
        xssTest: xssMock,
        placeholderList: placeholderMock,
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          StoryBookLayoutModule,
          RteViewModule,
          RouterModule.forRoot(
            [
              {
                path: '',
                component: RteViewComponent,
              },
              {
                path: 'employee-profile/:id',
                component: RteViewComponent,
              },
            ],
            { useHash: true }
          ),
        ],
        entryComponents: [],
        providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      },
    };
  },
  { notes: { markdown: note } }
);
