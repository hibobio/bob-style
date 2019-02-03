import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'b-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {

  @Output() progressChange: EventEmitter<MatSliderChange> = new EventEmitter<MatSliderChange>();
  @Input() value = 0;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() disabled = false;
  @Input() showLabel = false;
  @Input() readOnly = false;
  @Input() labelSymbol = '%';

  barFull: boolean;

  constructor() {
  }

  ngOnInit(): void {
    this.barFull = this.value === this.max;
  }

  public onProgressChange(event: MatSliderChange): void {
    this.barFull = event.value === this.max;
    this.value = event.value;
    this.progressChange.emit(event);
  }
}
