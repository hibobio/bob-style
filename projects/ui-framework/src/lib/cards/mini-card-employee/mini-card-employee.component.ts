import {Component, HostBinding, Input} from '@angular/core';
import {AvatarSize} from '../../buttons-indicators/avatar/avatar.enum';
import { MiniEmployeeCard } from './mini-card-employee.interface';

@Component({
  selector: 'b-mini-employee-card',
  templateUrl: './mini-card-employee.component.html',
  styleUrls: ['./mini-card-employee.component.scss']
})
export class MiniEmployeeCardComponent {
  @Input() clickable = false;
  @Input() card: MiniEmployeeCard;
  avatarSize = AvatarSize;
  @HostBinding('class.clickable')
  get isClickable(): boolean {
    return this.clickable;
  }
}

