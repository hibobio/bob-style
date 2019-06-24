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
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

@Component({
  selector: 'b-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss']
})
export class CollapsibleComponent implements AfterViewInit {
  constructor(private DOM: DOMhelpers) {}

  @Input() type: CollapsibleType = CollapsibleType.small;

  @Input() expanded = false;
  @Input() disabled = false;

  @Input() title: string;
  @Input() description?: string;

  @Output() opened: EventEmitter<void> = new EventEmitter<void>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('suffix', { static: false }) suffix: ElementRef;

  @HostBinding('class.collapsible-small') get isOfTypeSmall(): boolean {
    return this.type === CollapsibleType.small;
  }
  @HostBinding('class.collapsible-big') get isOfTypeBig(): boolean {
    return this.type === CollapsibleType.big;
  }

  hasSuffix = true;
  collapsibleType = CollapsibleType;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasSuffix = !this.DOM.isEmpty(this.suffix.nativeElement);
    }, 0);
  }

  onPanelOpened($event): void {
    this.opened.emit($event);
  }

  onPanelClosed($event): void {
    this.closed.emit($event);
  }

  stopPropagation($event): void {
    $event.stopPropagation();
  }
}
