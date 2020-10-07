import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'b-story-book-layout',
  template: `
    <div class="story-wrapper theme-bob">
      <b-display-3>{{ title }}</b-display-3>
      <div class="story-content">
        <ng-content></ng-content>
        <b-stats
          [rootElem]="'b-story-book-layout'"
          [countChildren]="true"
        ></b-stats>
      </div>
    </div>
  `,
  styleUrls: ['./story-book-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryBookLayoutComponent {
  @Input() title: string;

  constructor() {}
}
