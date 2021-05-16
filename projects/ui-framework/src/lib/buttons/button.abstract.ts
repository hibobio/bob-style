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

import { Icons, IconSize } from '../icons/icons.enum';
import { DialogButton } from '../popups/dialog/dialog.interface';
import {
  applyChanges,
  isFunction,
  isObject,
  isString,
  notFirstChanges,
  objectMapKeys,
  objectRemoveEntriesByValue,
  pass,
  unsubscribeArray,
} from '../services/utils/functional-utils';
import { insideZone } from '../services/utils/rxjs.operators';
import { GenericObject } from '../types';
import { BackButtonType, ButtonSize, ButtonType } from './buttons.enum';
import { Button, ButtonConfig } from './buttons.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseButtonElement
  implements OnChanges, OnInit, OnDestroy {
  constructor(protected cd: ChangeDetectorRef, protected zone: NgZone) {}

  @ViewChild('button', { static: true }) public button: ElementRef;

  @Input('button') set setProps(button: Button | DialogButton | ButtonConfig) {
    if (isObject(button)) {
      Object.assign(
        this,
        objectMapKeys<GenericObject, Button>(
          objectRemoveEntriesByValue(button, [undefined]),
          {
            label: 'text',
            class: 'id',
            action: 'onClick',
          }
        )
      );
    }
  }

  @Input() id: string;
  @Input() text: string;
  @Input() icon: Icons;
  @Input() active = false;
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

  public buttonClass: string = null;
  public icn: string;
  public icnSize: IconSize;

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

    this.icnSize =
      this.size === ButtonSize.large ? IconSize.large : IconSize.medium;
  }

  protected getButtonClass(): string {
    return (
      (this.id ? this.id + ' ' : '') +
      (this.type || this.typeDefault) +
      ' ' +
      (this.size || ButtonSize.medium) +
      ' ' +
      (this.active ? 'active ' : '') +
      (this.preloader ? 'preloader' : '')
    );
  }
}
