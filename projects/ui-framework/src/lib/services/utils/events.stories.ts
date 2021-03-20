import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { DoubleClickModule } from './clickDouble.directive';
import { ClickOutsideModule } from './clickOutside.directive';
import { InViewModule } from './inview.directive';
import { log } from './logger';
import { WindowKeydownModule } from './windowKeydown.directive';

const story = storiesOf(ComponentGroupType.Services, module);

const storyTemplate = `
<b-story-book-layout [title]="'Events'"><div style="max-width:700px;text-align:left;min-height:250vh;">

  <h4>ClickOutsideDirective</h4>

  <div class="flx flx-row-align-y">

    <div
     class="flx flx-center brd pad-16 b-caption mrg-r-24"
     style="user-select: none; width:150px; height:150px; border-color: black;"
    (click.outside)="clickedOutside($event); log('clicked Outside!')"
    (click)="clickedInside($event); log('clicked Inside!')">
      <span>click inside/outside the box and see log</span>
    </div>

    <div class="flx flx-row-align-y flx-grow">
      <textarea readonly class="flx-grow" style="resize:none;border:0;min-height: 7em;">${'<my-component \
         \n(click)="clickedInside()">\
         \n(click.outside)="clickedOutside()">\
         \n</my-component>'}</textarea>
    </div>

  </div>

  <h4 class="mrg-t-40">DoubleClickDirective</h4>

  <div class="flx flx-row-align-y">

    <div
     class="flx flx-center brd pad-16 b-caption mrg-r-24"
     style="user-select: none; width:150px; height:150px; border-color: black;"
    (click.double)="doubleClicked($event); log('Double clicked!')" [swallow]="true">
      <span>double click the box and see log</span>
    </div>

    <div class="flx flx-row-align-y flx-grow">
      <textarea readonly class="flx-grow" style="resize:none;border:0;min-height: 7em;">${'<my-component \
         \n(click.double)="doubleClicked()">\
         \n</my-component>'}</textarea>
    </div>

  </div>

  <h4 class="mrg-t-40">WindowKeydownDirective</h4>

  <div class="flx flx-row-align-y">

    <div
     class="flx flx-center brd pad-16 b-caption mrg-r-24"
     style="user-select: none; width:150px; height:150px; border-color: black;"
    (win.keydown.enter)="onEnter($event); log('Enter pressed!')"
    (win.keydown.escape)="onEscape($event); log('Escape pressed!')">
      <span>press Enter and Escape and see log</span>
    </div>

    <div class="flx flx-row-align-y flx-grow">
      <textarea readonly class="flx-grow" style="resize:none;border:0;min-height: 7em;">${'<my-component \
      \n(win.keydown.enter)="onEnter()" \
      \n(win.keydown.escape)="onEscape()">\
      \n</my-component>'}</textarea>
    </div>

  </div>


  <div class="mrg-t-40" style="text-align:center;font-size:30px">↓↓↓</div>

  <h4 style="margin-top: 50vh">InViewDirective</h4>

  <div class="flx flx-row-align-y">

    <div
     class="flx flx-center brd pad-16 b-caption mrg-r-24"
     style="user-select: none; width:150px; height:150px; border-color: black;"
     [style.backgroundColor]="isInView ? '#4682B4' : null"
     [style.color]="isInView ? 'white' : null"
    (inView)="onInView(isInView = $event); log('In View?',$event)">
      <span>scroll and see log</span>
    </div>

    <div class="flx flx-row-align-y flx-grow">
      <textarea class="flx-grow" style="resize:none;border:0;min-height: 7em;">${'<my-component \
      \n(inView)="onInView($event)">\
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

  #### Module
  *WindowKeydownModule*

  ~~~
  <my-component (win.keydown.enter)="onEnter()"
      (win.keydown.escape)="onEscape()">
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
        doubleClicked: action('doubleClicked'),
        onEnter: action('onEnter'),
        onEscape: action('onEscape'),
        onInView: action('onInView'),
        log: logger.info,
        isInView: false,
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, ClickOutsideModule, WindowKeydownModule, InViewModule, DoubleClickModule],
        declarations: [],
      },
    };
  },
  { notes: { markdown: note } }
);
