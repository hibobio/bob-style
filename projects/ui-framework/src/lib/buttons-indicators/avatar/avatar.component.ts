import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { AvatarSize, BadgeSize } from './avatar.enum';
import { BadgeConfig } from './avatar.interface';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

@Component({
  selector: 'b-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements AfterViewInit {
  @ViewChild('content') content: ElementRef;
  @Input() imageSource: string;
  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() isClickable = false;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() disabled = false;
  @Input() badge: BadgeConfig;
  @Output() clicked?: EventEmitter<void> = new EventEmitter<void>();

  public hasContent = true;
  public badgeSize = BadgeSize;
  constructor(private DOM: DOMhelpers) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasContent = !this.DOM.isEmpty(this.content.nativeElement);
    }, 0);
  }

  onClick(event) {
    if (this.isClickable) {
      this.clicked.emit(event);
    }
  }
}
