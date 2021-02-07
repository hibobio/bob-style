import { Component, Input, OnInit } from '@angular/core';
import { LegendConfig, LegendData } from './legend.interface';

@Component({
  selector: 'b-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
})
export class LegendComponent implements OnInit {
  constructor() {}

  @Input() data: LegendData[];
  @Input() config: LegendConfig;

  ngOnInit(): void {}
}
