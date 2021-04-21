import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import {
  mockAnimals,
  mockBadJobs,
  mockLinkHtml,
  mockText,
  mockThings,
} from '../../mock.const';
import {
  makeArray,
  randomFromArray,
  randomNumber,
} from '../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ReadMoreModule } from './read-more.module';

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

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template1 = `<p [readMore]="text" [maxLines]="maxLines"></p>`;

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
  *ReadMoreModule*

  ~~~
  ${template1}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [readMore] | string | full text
  [maxLines] | number | max lines to display before ellipsis
  (clicked) | EventEmitter | if listener exists, text will not be expanded, instead event will be emitted


`;

story.add(
  'Read More',
  () => {
    return {
      template: storyTemplate,
      props: {
        text: mockText(50),
        maxLines: number('maxLines', 5),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          ReadMoreModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
