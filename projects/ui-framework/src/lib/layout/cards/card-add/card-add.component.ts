import {
  Component,
  Input,
  Output,
  HostBinding,
  HostListener,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'b-card-add',
  template: `
    <b-display-3 card-content>
      {{ title }}
    </b-display-3>
    <p card-bottom *ngIf="subtitle">{{ subtitle }}</p>
  `,
  styleUrls: ['../card/card.component.scss', './card-add.component.scss']
})
export class CardAddComponent {
  constructor() {}

  @Input() title ? = '';
  @Input() subtitle?: string;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();
  @HostBinding('attr.tabindex') string = '0';

  @HostListener('click', ['$event'])
  onClick($event) {
    this.clicked.emit($event);
  }
}
