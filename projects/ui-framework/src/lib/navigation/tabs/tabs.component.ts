import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tab } from './tabs.interface';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'b-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  @Input() public tabs: Tab[] = [];
  @Input() public selectedIndex = 0;
  @Output() selectChange: EventEmitter<MatTabChangeEvent> = new EventEmitter<MatTabChangeEvent>();

  constructor() {
  }

  ngOnInit() {
  }

  public onSelectChange($event: MatTabChangeEvent) {
    this.selectChange.emit($event);
  }

}
