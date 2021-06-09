import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  Component,
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
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy {
  constructor(private zone: NgZone) {}

  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;

  @Input() value = '';
  @Input() label: string;
  @Input() placeholder: string;

  @Input() config: SearchConfig;

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
  @Output()
  searchBlur: EventEmitter<DOMFocusEvent> = new EventEmitter();

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
        .subscribe((inputEvent: DOMInputEvent) => {
          this.onInput(inputEvent);
        });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onFocus(): void {
    this.inputFocused = true;

    if (!this.skipFocusEvent && this.searchFocus.observers) {
      this.searchFocus.emit(this.value);
    }
    this.skipFocusEvent = false;
  }

  onBlur(event: Event | FocusEvent): void;
  onBlur(event: DOMFocusEvent): void {
    this.inputFocused = false;
    if (this.searchBlur.observers) {
      this.searchBlur.emit(event);
    }
  }

  onInput(event: DOMInputEvent): void {
    const newValue = event.target.value;
    if (this.value !== newValue) {
      this.value = newValue;
      this.searchChange.emit(this.value.trim());
    }
  }

  onResetClick(): void {
    this.skipFocusEvent = true;
    this.value = '';
    this.searchChange.emit(this.value);
  }
}
