import { Component } from '@angular/core';

@Component({
  selector: 'b-body, [b-body]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  constructor() {}
}
