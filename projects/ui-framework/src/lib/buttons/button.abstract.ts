import { fromEvent, Subscription } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';

import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { IconColor, Icons, IconSize } from '../icons/icons.enum';
import {
  applyChanges,
  isFunction,
  isObject,
  isString,
  notFirstChanges,
  objectRemoveEntriesByValue,
  pass,
  unsubscribeArray,
} from '../services/utils/functional-utils';
import { insideZone } from '../services/utils/rxjs.operators';
import { BackButtonType, ButtonSize, ButtonType } from './buttons.enum';
import { Button } from './buttons.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseButtonElement implements OnChanges, OnInit, OnDestroy {
  constructor(protected cd: ChangeDetectorRef, protected zone: NgZone) {}

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

  @Input() public type: ButtonType | BackButtonType;
  @Input() public swallow = false;
  @Input() public throttle: number;

  @HostBinding('attr.data-type') get getButtonType() {
    return this.type || this.typeDefault;
  }
  @HostBinding('attr.data-size') @Input() public size: ButtonSize = null;
  @HostBinding('attr.data-disabled') @Input() public disabled = false;

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

  protected readonly subs: Subscription[] = [];

  onClick: (event: MouseEvent) => void;

  ngOnChanges(changes: SimpleChanges, dc = true): void {
    applyChanges(this, changes);
    this.setIconVars();
    this.buttonClass = this.getButtonClass();

    if (notFirstChanges(changes, ['throttle']) && this.subs.length) {
      this.setClickListener();
    }

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
    this.setClickListener();
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);
  }

  protected setClickListener() {
    unsubscribeArray(this.subs);

    this.zone.runOutsideAngular(() => {
      this.subs.push(
        fromEvent<MouseEvent>(this.button.nativeElement, 'click', {
          capture: true,
        })
          .pipe(
            tap((event) => {
              if (this.swallow) {
                event.preventDefault();
                event.stopPropagation();
              }
            }),
            this.throttle > 0
              ? throttleTime(this.throttle, undefined, {
                  leading: true,
                  trailing: false,
                })
              : pass,
            insideZone(this.zone)
          )
          .subscribe((event) => {
            isFunction(this.onClick) && this.onClick(event);
            this.clicked.emit(event);
          })
      );
    });
  }

  protected setIconVars(): void {
    this.icn = isString(this.icon) && this.icon.replace('b-icon-', '');

    this.icnSize = this.size === ButtonSize.large ? IconSize.large : IconSize.medium;

    this.icnColor =
      this.type === ButtonType.primary ||
      this.type === ButtonType.negative ||
      (!this.type && (this.typeDefault === ButtonType.primary || this.typeDefault === ButtonType.negative))
        ? IconColor.white
        : this.disabled
        ? IconColor.normal
        : IconColor.dark;
  }

  protected getButtonClass(): string {
    return (
      (this.type || this.typeDefault) +
      ' ' +
      (this.size || ButtonSize.medium) +
      ' ' +
      (this.active ? 'active ' : '') +
      (this.preloader ? 'preloader' : '')
    );
  }
}
