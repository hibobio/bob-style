import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CollapsibleType } from './collapsible.enum';

@Component({
  selector: 'b-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss']
})
export class CollapsibleComponent implements AfterViewInit {
  constructor() {}

  @HostBinding('class')
  get typeClass() {
    return 'collapsible-' + this.type;
  }

  @Input() type: CollapsibleType = CollapsibleType.small;

  @Input() expanded = false;
  @Input() disabled = false;

  @Input() title: string;
  @Input() description?: string;

  @Output() opened: EventEmitter<void> = new EventEmitter<void>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('suffix') suffix: ElementRef;

  hasSuffix = true;

  open(): void {
    if (!this.disabled) {
      this.expanded = true;
    }
  }

  close(): void {
    this.expanded = false;
  }

  toggle(): void {
    if (!this.disabled) {
      this.expanded = !this.expanded;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasSuffix =
        this.suffix.nativeElement.children.length !== 0 ? true : false;
    }, 0);
  }

  onPanelOpened($event): void {
    this.opened.emit($event);
  }

  onPanelClosed($event): void {
    this.closed.emit($event);
  }
}
