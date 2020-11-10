import { storiesOf } from '@storybook/angular';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ComponentGroupType } from '../../consts';
import { UtilsService } from './utils.service';
import { Component } from '@angular/core';
import { counter } from './rxjs.operators';

const story = storiesOf(ComponentGroupType.Services, module);

const storyTemplate = `
<b-story-book-layout [title]="'Utils'">

  <b-window-events></b-window-events>

</b-story-book-layout>
`;

const note = `
  ## Utils Service
  #### Module
  *UtilsModule*

  #### Methods

  ##### getResizeEvent(outsideNgZone = false)
  Returns observable of window resize events

  ##### getScrollEvent(outsideNgZone = false)
  Returns observable of scroll event with ScrollEvent interface

  ##### getWindowClickEvent(outsideNgZone = false)
  Returns observable of window click event with MouseEvent interface

  ##### getWindowKeydownEvent(outsideNgZone = false)
  Returns observable of window keydown event with KeyboardEvent interface

  **Note:** providing true as argument will return rxjs observable that is created outside NgZone, so window events will not trigger global change detection.<br>
  If something further down the chain doesnt work, you may need to return the stream to NgZone, for example by using operator \`\`\`insideZone(this.zone)\`\`\`, or wrapping the code in subscribe block with \`\`\`this.zone.run(()=>{...}) \`\`\`.<br>
  Usually you want the stream before filters, debouncers or throttles to be outside zone, and only return to the zone in the end of the pipe.
`;

// ##### getElementInViewEvent(element: HTMLElement): Observable&lt;boolean&gt;
// Returns observable of when element comes into / leaves viewport

@Component({
  selector: 'b-window-events',
  template: `
    <h4>Window events</h4>
    <p>winResize: {{ winResize$ | async }}</p>
    <p>winScroll: {{ winScroll$ | async }}</p>
    <p>winClick: {{ winClick$ | async }}</p>
    <p>winKey: {{ winKey$ | async }}</p>
  `,
  styles: [
    `
      :host {
        width: 200px;
        padding: 16px;
        border: 1px solid black;
        text-align: left;
      }
    `,
  ],
  providers: [],
})
export class WinEventsComponent {
  constructor(private utilsService: UtilsService) {}

  winResize$ = this.utilsService.getResizeEvent().pipe(counter());
  winScroll$ = this.utilsService.getScrollEvent().pipe(counter());
  winClick$ = this.utilsService.getWindowClickEvent().pipe(counter());
  winKey$ = this.utilsService.getWindowKeydownEvent().pipe(counter());
}

story.add(
  'UtilsService',
  () => {
    return {
      template: storyTemplate,
      props: {},
      moduleMetadata: {
        imports: [StoryBookLayoutModule],
        declarations: [WinEventsComponent],
      },
    };
  },
  { notes: { markdown: note } }
);
