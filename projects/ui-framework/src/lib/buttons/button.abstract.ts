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
  isObject,
  objectRemoveEntriesByValue,
} from '../services/utils/functional-utils';
import { Button } from './buttons.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseButtonElement implements OnChanges, OnInit {
  constructor(protected cd: ChangeDetectorRef) {}

  @ViewChild('button', { static: true }) public button: ElementRef;

  @Input('button') set setProps(button: Button) {
    if (isObject(button)) {
      Object.assign(this, objectRemoveEntriesByValue(button, [undefined]));
    }
  }

  @Input() text: string;
  @Input() icon: Icons;
  @Input() active = false;
  @Input() color: any;
  @Input() preloader = false;

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
  @HostBinding('attr.data-size') @Input() public size: ButtonSize = null;
  @HostBinding('attr.data-disabled') @Input() public disabled = false;

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
