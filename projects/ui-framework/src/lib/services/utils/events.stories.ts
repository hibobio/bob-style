import { storiesOf } from '@storybook/angular';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ComponentGroupType } from '../../consts';
import { ClickOutsideModule } from './clickOutside.directive';
import { action } from '@storybook/addon-actions';
import { log } from './logger';

const story = storiesOf(ComponentGroupType.Services, module);

const storyTemplate = `
<b-story-book-layout [title]="'Events'"><div style="max-width:700px;text-align:left;">

  <h4>ClickOutsideDirective</h4>

  <div class="flx flx-row-align-y">

    <div
     class="flx flx-center brd pad-16 b-caption mrg-r-24"
     style="width:150px; height:150px; border-color: black;"
    (click.outside)="clickedOutside($event); log('clicked outside!')"
    (click)="clickedInside($event); log('clicked inside!')">
      <span>click inside/outside the box and see log</span>
    </div>

    <div class="flx flx-row-align-y flx-grow">
      <textarea class="flx-grow" style="resize:none;border:0;min-height: 6em;">${'<my-component \
         \n(click)="clickedInside()">\
         \n(click.outside)="clickedOutside()">\
         \n</my-component>'}</textarea>
    </div>

  </div>

</div></b-story-book-layout>
`;

const note = `

  #### Module
  *ClickOutsideModule*

  ~~~
  <my-component (click.outside)="clickedOutside()">
  ~~~

`;

const logger = new log('event');

story.add(
  'Events',
  () => {
    return {
      template: storyTemplate,
      props: {
        clickedInside: action('clickedInside'),
        clickedOutside: action('clickedOutside'),
        log: logger.info,
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, ClickOutsideModule],
        declarations: [],
      },
    };
  },
  { notes: { markdown: note } }
);
