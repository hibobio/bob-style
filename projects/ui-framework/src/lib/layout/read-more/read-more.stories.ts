import { storiesOf } from '@storybook/angular';
import {
  text,
  number,
  withKnobs,
  boolean,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { RteViewModule } from '../../../../bob-rte/src/rte-view/rte-view.module';
import { ReadMoreModule } from './read-more.module';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RteViewComponent } from '../../../../bob-rte/src/rte-view/rte-view.component';
import {
  makeArray,
  randomNumber,
  randomFromArray,
} from '../../services/utils/functional-utils';
import {
  mockText,
  mockLinkHtml,
  mockBadJobs,
  mockAnimals,
  mockThings,
} from '../../mock.const';
import { action } from '@storybook/addon-actions';

const rteMockHtml =
  'Imagine ' +
  makeArray(randomNumber(10, 15))
    .map((_) => mockText(randomNumber(12, 20)))
    .reduce((str, i: string, ind) => {
      return (str +=
        i.toLowerCase() +
        randomFromArray([
          ` ${mockLinkHtml()}${randomFromArray([
            '. Luckily, ',
            '... <br>Also, ',
            '! And so, ',
          ])} `,
          ` <strong>${mockLinkHtml()}</strong>${randomFromArray([
            '! <br>Luckily, ',
            '. Also, ',
            '!!!! And so, ',
          ])} `,
          `. <br><span style="font-size: 18px">AND THEN HE</span> `,
          `. <br><span style="font-size: 24px">AND THEN HE</span> `,
          `. <br><span style="font-size: 18px"> UNFORTUNATELY, </span> `,
          `. <br><span style="font-size: 24px"> BUT!!! </span> `,
          ` <strong>${mockBadJobs(1)}</strong> `,
          ` <strong>${mockBadJobs(1)}</strong> `,
          ` <strong>${mockBadJobs(1)}</strong> `,
          ` <em><u>${mockAnimals(1)}</u></em> `,
          ` <em><u>${mockThings(1)}</u></em> `,
          ` <em><u>${mockThings(1)}</u></em> `,
        ]));
    }, '') +
  ' ' +
  mockText(randomNumber(3, 5)).toLowerCase() +
  ' and that was the end.';

// const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
//   withKnobs
// );

const template1 = `<b-read-more [config]="{
  maxLines: maxLines,
  maxHeight: maxHeight,
  expandable: expandable,
  watchClicks: true,
  dynamicFontSize: true
}"
(clicked)="onClick($event)">
<b-rich-text-view [type]="'shoutout'"
          [value]="rteMockHtml">
</b-rich-text-view>
</b-read-more>`;

const templateForNotes = ``;

const storyTemplate = `
<b-story-book-layout [title]="'Read More'">
<div>
  ${template1}
</div>
</b-story-book-layout>
`;

const note = `
  ## Read More
  #### Module
  *MasonryLayoutModule*

  ~~~
  ${template1}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---



`;

// story.add(
//   'Read More',
//   () => {
//     return {
//       template: storyTemplate,
//       props: {
//         rteMockHtml: rteMockHtml,
//         expandable: boolean('expandable', false),
//         maxLines: number('maxLines', 5),
//         maxHeight: number('maxHeight', 300),
//         onClick: action('click'),
//       },
//       moduleMetadata: {
//         imports: [
//           BrowserAnimationsModule,
//           StoryBookLayoutModule,
//           ReadMoreModule,
//           RteViewModule,
//           RouterModule.forRoot(
//             [
//               {
//                 path: '',
//                 component: RteViewComponent,
//               },
//               {
//                 path: 'employee-profile/:id',
//                 component: RteViewComponent,
//               },
//             ],
//             { useHash: true }
//           ),
//         ],
//         providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
//       },
//     };
//   },
//   { notes: { markdown: note } }
// );
