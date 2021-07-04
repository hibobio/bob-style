import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { FormElementSize } from '../../form-elements/form-elements.enum';
import {
  InputAutoCompleteOptions,
  InputTypes,
} from '../../form-elements/input/input.enum';
import { ICON_CONFIG } from '../../icons/common-icons.const';
import { Icon } from '../../icons/icon.interface';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { simpleUID } from '../../services/utils/functional-utils';
import { insideZone } from '../../services/utils/rxjs.operators';
import { DOMFocusEvent, DOMInputEvent } from '../../types';
import { SearchConfig } from './search.interface';

@Component({
  selector: 'b-search',
  templateUrl: './search.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    './search.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy {
  constructor(
    public hostElRef: ElementRef<HTMLElement>,
    private zone: NgZone,
    public cd: ChangeDetectorRef
  ) {}

  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;

  @Input() value = '';
  @Input() label: string;
  @Input() placeholder: string;

  @Input() config: SearchConfig;

  @Input() hideIcon = false;
  @Input() hideLabelOnFocus = true;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;

  @Input() id = simpleUID('bsrch');

  @HostBinding('attr.data-size') @Input() size = FormElementSize.regular;

  public inputFocused = false;

  readonly inputTypes = InputTypes;
  readonly iconColor = IconColor;
  readonly clearIcn: Icon = ICON_CONFIG.reset;
  readonly searchIcn: Icon = {
    icon: Icons.search,
    size: IconSize.medium,
    hasHoverState: true,
  };

  private skipFocusEvent = false;
  private sub: Subscription;

  @Output() searchChange: EventEmitter<string> = new EventEmitter();
  @Output() searchFocus: EventEmitter<string> = new EventEmitter();
  @Output() searchBlur: EventEmitter<DOMFocusEvent> = new EventEmitter();

  @HostListener('focusin.outside-zone', ['$event']) onHostFocus(
    event: DOMFocusEvent
  ) {
    if (event.target.matches('.bfe-wrap')) {
      this.focus();
    }
    if (event.target.matches('.bfe-input')) {
      this.inputFocused = true;
      if (!this.skipFocusEvent && this.searchFocus.observers) {
        this.zone.run(() => {
          this.searchFocus.emit(this.value);
        });
      }
      this.skipFocusEvent = false;
      this.cd.detectChanges();
    }
  }

  @HostListener('focusout.outside-zone', ['$event']) onHostBlur(
    event: DOMFocusEvent
  ) {
    if (event.target.matches('.bfe-input')) {
      if (this.hostElRef.nativeElement.contains(event.relatedTarget)) {
        event.preventDefault();
        this.input.nativeElement.focus();
        return;
      }
      this.inputFocused = false;
      if (this.searchBlur.observers) {
        this.zone.run(() => {
          this.searchBlur.emit(event);
        });
      }
      this.cd.detectChanges();
    }
  }

  @HostListener('click.outside-zone', ['$event']) onHostClick(
    event: DOMFocusEvent
  ) {
    const target = event.target;
    if (target.matches('.bfe-wrap')) {
      this.focus();
    }
    if (target.matches('.clear-input')) {
      event.stopPropagation();
      this.zone.run(() => {
        this.reset();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.value = changes.value.currentValue;
    }
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.sub = fromEvent(this.input.nativeElement, 'input', {
        passive: true,
      })
        .pipe(
          debounceTime(this.config?.debounceTime || 150),
          insideZone(this.zone)
        )
        .subscribe((event: DOMInputEvent) => {
          //
          const newValue = event.target.value;
          if (this.value !== newValue) {
            this.value = newValue;
            this.cd.detectChanges();
            this.searchChange.emit(this.value);
          }
          //
        });
    });
  }

  focus() {
    this.input.nativeElement.focus();
  }

  reset(): void {
    this.skipFocusEvent = true;
    this.value = '';
    this.cd.detectChanges();
    this.searchChange.emit(this.value);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
