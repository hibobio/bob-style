import { Component } from '@angular/core';

@Component({
  selector: 'b-heading, [b-heading]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent {
  constructor() {}
}
