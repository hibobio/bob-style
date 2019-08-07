import { Component } from '@angular/core';

@Component({
  selector: 'b-subheading, [b-subheading]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./subheading.component.scss']
})
export class SubHeadingComponent {
  constructor() {}
}
