import { Component } from '@angular/core';

@Component({
  selector: 'b-bold-body',
  template: '<ng-content></ng-content>',
  styleUrls: ['./bold-body.component.scss']
})
export class BoldBodyComponent {
  constructor() { }
}
