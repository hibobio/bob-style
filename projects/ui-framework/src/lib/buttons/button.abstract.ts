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
  HostBinding,
  Directive,
} from '@angular/core';
import { ButtonType, ButtonSize, BackButtonType } from './buttons.enum';
import { Icons, IconColor, IconSize } from '../icons/icons.enum';
import {
  notFirstChanges,
  applyChanges,
} from '../services/utils/functional-utils';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseButtonElement implements OnChanges, OnInit {
  constructor(protected cd: ChangeDetectorRef) {}

  @ViewChild('button', { static: true }) public button: ElementRef;

  @Input() text: string;
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

  @HostBinding('attr.data-type') @Input() public type:
    | ButtonType
    | BackButtonType;

  @HostBinding('attr.data-disabled') @Input() public disabled = false;
  @HostBinding('attr.data-size') @Input() public size: ButtonSize = null;

  ngOnInit(): void {
    if (!this.buttonClass) {
      this.buttonClass = this.getButtonClass();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    this.buttonClass = this.getButtonClass();

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
