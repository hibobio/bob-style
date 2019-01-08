import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSliderChange} from '@angular/material';

@Component({
  selector: 'b-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  @Output() progressChange: EventEmitter<MatSliderChange> = new EventEmitter<MatSliderChange>();
  @Input() value?: Number = 0;
  @Input() min?: Number = 0;
  @Input() max?: Number = 100;
  @Input() step?: Number = 1;
  @Input() disabled?: Boolean = false;
  @Input() showLabel?: Boolean = false;
  @Input() readOnly?: Boolean = false;
  @Input() labelSymbol?: String = '%';
  constructor() {
  }

  ngOnInit(): void {
  }

  public onProgressChange(event: MatSliderChange): void {
    this.value = event.value;
    this.progressChange.emit(event);
  }
}
