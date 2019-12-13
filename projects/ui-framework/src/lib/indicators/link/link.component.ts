import { Component, Input } from '@angular/core';
import { Link } from '../link/link.types';

@Component({
  selector: 'b-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {
  @Input() config: Link;

  constructor() { }
}
