import { Component, Input } from '@angular/core';

@Component({
  selector: 'b-divider, [b-divider]',
  template: `{{text}}`,
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent {

  @Input() text: string = null;

}
