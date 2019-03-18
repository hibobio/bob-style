import {
  Component,
  Input,
  Output,
  HostBinding,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'b-card-add',
  template: `
    <div card-content
      (click)="onClick($event)">
        <b-display-3>
          {{ title }}
        </b-display-3>
        <p *ngIf="subtitle">{{ subtitle }}</p>
    </div>
  `,
  styleUrls: ['../card/card.component.scss',
              './card-add.component.scss'],
})
export class CardAddComponent {
  constructor() {}

  @Input() title ? = '';
  @Input() subtitle?: string;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();
  @HostBinding('attr.tabindex') string = '0';

  onClick($event) {
    this.clicked.emit($event);
  }
}
