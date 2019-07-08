import {Component, Input, OnInit} from '@angular/core';
import {AvatarSize} from '../../buttons-indicators/avatar/avatar.enum';

export interface MiniProfileCardData {
  name: string;
  title: string;
  dates: string;
  avatar: string;
}

@Component({
  selector: 'b-card-profile',
  templateUrl: './card-profile.component.html',
  styleUrls: ['./card-profile.component.scss']
})
export class CardProfileComponent implements OnInit {
  avatarSize = AvatarSize.small;
  @Input() card: MiniProfileCardData;
  constructor() { }

  ngOnInit() {
  }

}

