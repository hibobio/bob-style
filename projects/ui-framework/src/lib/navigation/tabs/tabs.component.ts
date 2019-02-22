import { Component, Input, OnInit } from '@angular/core';
import { Tab } from './tabs.interface';

@Component({
  selector: 'b-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  @Input() public onSelectedTabChange: Function;
  @Input() public tabs: Tab[] = [];
  @Input() public selectedIndex = 0;

  constructor() { }

  ngOnInit() {
  }

}
