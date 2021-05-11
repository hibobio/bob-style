import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'b-select-and-view',
  templateUrl: './select-and-view.component.html',
  styleUrls: ['./select-and-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectAndViewComponent {
}
