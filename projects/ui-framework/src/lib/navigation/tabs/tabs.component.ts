import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import { Tab } from './tabs.interface';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { TabsType } from './tabs.enum';

@Component({
  selector: 'b-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements AfterViewInit {
  @ViewChildren('matLabels') matLabels: QueryList<ElementRef>;

  // This input determine if the tabs will be changed automatically on click.
  @Input() controlled: boolean;
  @Input() public type: TabsType = TabsType.primary;
  @Input() public tabs: Tab[] = [];
  @Input() public selectedIndex = 0;

  @Output() selectChange: EventEmitter<MatTabChangeEvent> = new EventEmitter<
    MatTabChangeEvent
  >();
  @Output() selectClick: EventEmitter<MatTabChangeEvent> = new EventEmitter<
    MatTabChangeEvent
  >();

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    this.matLabels.toArray().forEach(label => {
      const element = label.nativeElement;
      element.style.minWidth = element.scrollWidth + 10 + 'px';
    });
  }

  tabClick(tab: Tab, index: number): void {
    if (!this.controlled) {
      this.selectedIndex = index;
    }
    if (this.selectClick.observers.length > 0) {
      this.zone.run(() => {
        this.selectClick.emit({ tab, index } as any);
      });
    }
  }

  onSelectChange($event: MatTabChangeEvent): void {
    this.selectChange.emit({
      index: $event.index,
      tab: this.tabs[$event.index]
    } as any);
  }
}
