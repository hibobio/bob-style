import {
  Component,
  Input,
  HostBinding,
  OnInit,
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
export class CollapsibleComponent implements OnInit, AfterViewInit {
  constructor() {}

  @HostBinding('class')
  get typeClass() {
    return 'collapsible-' + this.type;
  }

  @Input() type: CollapsibleType = CollapsibleType.small;

  @Input() title: string;
  @Input() description?: string;

  @ViewChild('suffix') suffix: ElementRef;

  hasSuffix = true;

  ngAfterViewInit() {
    this.hasSuffix =
      this.suffix.nativeElement.children.length !== 0 ? true : false;
  }

  ngOnInit() {}
}
