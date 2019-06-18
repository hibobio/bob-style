import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Tab } from './tabs.interface';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material';
import { TabsType } from './tabs.enum';

@Component({
  selector: 'b-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterViewInit {
  @Input() public type: TabsType = TabsType.primary;
  @Input() public tabs: Tab[] = [];
  @Input() public selectedIndex = 0;
  @Output() selectChange: EventEmitter<MatTabChangeEvent> = new EventEmitter<
    MatTabChangeEvent
  >();

  @ViewChild('tabgroup', { static: true }) tabGroup: MatTabGroup;

  constructor() {}

  ngAfterViewInit() {
    this.tabGroup._tabHeader._labelWrappers.forEach(label => {
      const element = label.elementRef.nativeElement;
      element.style.width = element.clientWidth + 10 + 'px';
    });
  }

  public onSelectChange($event: MatTabChangeEvent) {
    this.selectChange.emit($event);
  }
}
