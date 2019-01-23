import { Component, Input } from '@angular/core';

@Component({
  selector: 'b-group',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {

  constructor() { }
}
