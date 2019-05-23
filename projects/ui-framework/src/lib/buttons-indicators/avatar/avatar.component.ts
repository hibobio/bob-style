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
export class AvatarComponent implements OnInit, AfterViewInit {
  @ViewChild('content') private content: ElementRef;
  @Input() imageSource: string;
  @Input() backgroundColor?: string;
  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() isClickable = false;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() disabled = false;
  @Input() badge: BadgeConfig;
  @Output() clicked?: EventEmitter<void> = new EventEmitter<void>();

  public hasContent = true;
  public avatarSize = AvatarSize;
  public badgeSize = BadgeSize;
  constructor(private host: ElementRef, private DOM: DOMhelpers) {}

  ngOnInit(): void {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--avatar-size': this.size + 'px'
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasContent =
        this.content && !this.DOM.isEmpty(this.content.nativeElement);
    }, 0);
  }

  getSizeClass(value: any): string {
    return Object.keys(AvatarSize).find(key => AvatarSize[key] === value);
  }

  onClick(event: any): void {
    if (this.isClickable) {
      this.clicked.emit(event);
    }
  }
}
