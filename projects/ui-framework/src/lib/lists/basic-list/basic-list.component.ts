import { Component, ContentChild, Input } from '@angular/core';
import { BasicListItem } from './basic-list.interface';
import { BasicListActionDirective } from './basic-list-action.directive';
import { IconColor } from '../../icons/icons.enum';

@Component({
  selector: 'b-basic-list',
  templateUrl: './basic-list.component.html',
  styleUrls: ['./basic-list.component.scss'],
})
export class BasicListComponent {
  @Input() items: BasicListItem[];
  @ContentChild(BasicListActionDirective, { static: true })
  contentChild!: BasicListActionDirective;
  readonly iconColor = IconColor;
}
