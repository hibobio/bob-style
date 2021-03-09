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
  isString,
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
  public icn: string;
  public icnSize: IconSize;
  public icnColor: IconColor;

  protected typeDefault = ButtonType.primary;

  @Input() public type: ButtonType | BackButtonType;

  @HostBinding('attr.data-type') get getButtonType() {
    return this.type || this.typeDefault;
  }
  @HostBinding('attr.data-size') @Input() public size: ButtonSize = null;
  @HostBinding('attr.data-disabled') @Input() public disabled = false;

  ngOnChanges(changes: SimpleChanges, dc = true): void {
    applyChanges(this, changes);
    this.setIconVars();
    this.buttonClass = this.getButtonClass();

    if (dc && notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    if (!this.buttonClass) {
      this.setIconVars();
      this.buttonClass = this.getButtonClass();
      this.cd.detectChanges();
    }
  }

  private setIconVars() {
    this.icn = isString(this.icon) && this.icon.replace('b-icon-', '');

    this.icnSize =
      this.size === ButtonSize.large ? IconSize.large : IconSize.medium;

    this.icnColor =
      this.type === ButtonType.primary ||
      this.type === ButtonType.negative ||
      (!this.type &&
        (this.typeDefault === ButtonType.primary ||
          this.typeDefault === ButtonType.negative))
        ? IconColor.white
        : this.disabled
        ? IconColor.normal
        : IconColor.dark;
  }

  getButtonClass(): string {
    return (
      (this.type || this.typeDefault) +
      ' ' +
      (this.size || ButtonSize.medium) +
      ' ' +
      (this.active ? 'active ' : '') +
      (this.preloader ? 'preloader' : '')
    );
  }

  onClick($event: MouseEvent) {
    if (this.clicked.observers.length > 0) {
      this.clicked.emit($event);
    }
  }
}
