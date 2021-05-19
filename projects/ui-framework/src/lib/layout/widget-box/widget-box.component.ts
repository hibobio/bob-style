import { Component, Input, OnInit } from '@angular/core';
import { ButtonType } from 'bob-style';

@Component({
  selector: 'b-widget-box, [b-widget-box]',
  templateUrl: './widget-box.component.html',
  styleUrls: ['./widget-box.component.scss']
})
export class WidgetBoxComponent implements OnInit {
  readonly buttonType = ButtonType;
  
  @Input() title: string;

  constructor() { }

  ngOnInit() { }
  
}
