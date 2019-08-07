import { Component } from '@angular/core';

@Component({
  selector: 'b-caption, [b-caption]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./caption.component.scss']
})
export class CaptionComponent {
  constructor() {}
}
