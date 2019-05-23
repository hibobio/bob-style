import { Component, Input } from '@angular/core';

@Component({
  selector: 'b-story-book-layout',
  template: `
    <div class="story-wrapper">
      <b-display-3>{{ title }}</b-display-3>
      <div class="story-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./story-book-layout.component.scss']
})
export class StoryBookLayoutComponent {
  @Input() title: string;

  constructor() {}
}
