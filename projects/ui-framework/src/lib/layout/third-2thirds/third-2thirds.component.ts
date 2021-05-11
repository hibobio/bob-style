import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'b-third-2thirds',
  template: `<div class="layout-container">
              <div><ng-content select="[main]"></ng-content></div>
              <div><ng-content select="[side]"></ng-content></div>
             </div>`,
  styleUrls: ['./third-2thirds.component.scss'],
})

export class Third2ThirdsComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
  
}
