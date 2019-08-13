import { Component } from '@angular/core';

@Component({
  selector: 'b-big-body, [b-big-body]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./big-body.component.scss']
})
export class BigBodyComponent {
  constructor() {}
}
