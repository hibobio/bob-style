import {Component, HostBinding, Input} from '@angular/core';
import {AvatarSize} from '../../buttons-indicators/avatar/avatar.enum';

export interface MiniEmployeeCard {
  name: string;
  title: string;
  dates: string;
  imageSource: string;
}

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
    console.log(this.clickable);
    return this.clickable;
  }
}

