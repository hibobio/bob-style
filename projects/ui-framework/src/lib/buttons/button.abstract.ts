import {
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { ButtonType, ButtonSize, BackButtonType } from './buttons.enum';
import { Icons, IconColor, IconSize } from '../icons/icons.enum';
import {
  hasChanges,
  notFirstChanges,
  applyChanges,
} from '../services/utils/functional-utils';

export abstract class BaseButtonElement implements OnChanges, OnInit {
  constructor(protected cd: ChangeDetectorRef) {}

  @ViewChild('button', { static: true }) public button: ElementRef;

  @Input() text: string;
  @Input() disabled = false;
  @Input() type: ButtonType | BackButtonType;
  @Input() size: ButtonSize;
  @Input() icon: Icons;
  @Input() active = false;
  @Input() color: any;

  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  public buttonClass: string = null;

  ngOnInit(): void {
    if (!this.buttonClass) {
      this.buttonClass = this.getButtonClass();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (
      hasChanges(changes, [
        'icon',
        'size',
        'type',
        'active',
        'color',
        'disabled',
      ])
    ) {
      this.buttonClass = this.getButtonClass();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  getButtonClass(): string {
    return null;
  }

  onClick($event: MouseEvent) {
    if (this.clicked.observers.length > 0) {
      this.clicked.emit($event);
    }
  }
}
