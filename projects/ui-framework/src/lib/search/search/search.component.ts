import {
  Component,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ElementRef,
  HostBinding,
  OnInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import {
  InputTypes,
  InputAutoCompleteOptions,
} from '../../form-elements/input/input.enum';
import { simpleUID } from '../../services/utils/functional-utils';
import { DOMInputEvent } from '../../types';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { insideZone } from '../../services/utils/rxjs.operators';

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
  @Input() hideLabelOnFocus = true;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;
  @Input() id = simpleUID('bsrch-');

  @HostBinding('attr.data-size') @Input() size = FormElementSize.regular;

  public inputFocused = false;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly inputTypes = InputTypes;

  private skipFocusEvent = false;
  private sub: Subscription;

  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchFocus: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchBlur: EventEmitter<FocusEvent> = new EventEmitter<
    FocusEvent
  >();

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
        .pipe(debounceTime(150), insideZone(this.zone))
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

  onBlur(event: FocusEvent): void {
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
