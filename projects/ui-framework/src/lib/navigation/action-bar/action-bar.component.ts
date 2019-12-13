import { Component, Input } from '@angular/core';

@Component({
  selector: 'b-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent {
  @Input() label: string;
  @Input() showLabel = true;
}
