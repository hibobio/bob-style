import { Component, Input, OnInit } from '@angular/core';
import { ButtonType, ButtonSize } from 'bob-style';

@Component({
  selector: 'b-widget-box, [b-widget-box]',
  templateUrl: './widget-box.component.html',
  styleUrls: ['./widget-box.component.scss']
})
export class WidgetBoxComponent implements OnInit {
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  
  @Input() title: string;

  constructor() { }

  ngOnInit() { }
  
}
