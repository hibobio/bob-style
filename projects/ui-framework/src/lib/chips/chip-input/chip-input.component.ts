import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  forwardRef,
  OnInit,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete
} from '@angular/material/autocomplete';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { ChipType } from '../chips.enum';
import { ChipInputChange, ChipListConfig, Chip } from '../chips.interface';
import { InputTypes } from '../../form-elements/input/input.enum';
import { isKey } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { InputEventType } from '../../form-elements/form-elements.enum';
import { arrayOrFail } from '../../services/utils/transformers';
import { ChipListComponent } from '../chip-list/chip-list.component';
import { UtilsService } from '../../services/utils/utils.service';
import { Subscription } from 'rxjs';
import { outsideZone } from '../../services/utils/rxjs.operators';

@Component({
  selector: 'b-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    './chip-input.component.scss'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipInputComponent extends BaseFormElement
  implements OnChanges, OnInit, OnDestroy {
  constructor(private utilsService: UtilsService, private zone: NgZone) {
    super();
    this.inputTransformers = [arrayOrFail];
    this.baseValue = [];
  }

  @Input() value: string[] = [];
  @Input() options: string[] = [];
  @Input() acceptNew = true;

  private possibleChips: string[] = [];
  public filteredChips: string[] = this.options;
  public readonly inputTypes = InputTypes;

  readonly chipListConfig: ChipListConfig = {
    type: ChipType.tag,
    removable: true,
    focusable: true
  };

  @ViewChild('chips', { static: true }) public chips: ChipListComponent;
  @ViewChild('input', { static: true }) private input: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('input', { read: MatAutocompleteTrigger, static: true })
  private autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('auto', { static: true })
  private autocompletePanel: MatAutocomplete;
  private windowClickSubscriber: Subscription;

  @Output() changed: EventEmitter<ChipInputChange> = new EventEmitter<
    ChipInputChange
  >();

  // this extends BaseFormElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (changes.value && !changes.value.firstChange) {
      this.updatePossibleChips();
    }
    if (changes.options && !changes.options.firstChange) {
      this.options = changes.options.currentValue || [];
      this.updatePossibleChips();
    }
  }

  ngOnInit(): void {
    this.updatePossibleChips();

    this.windowClickSubscriber = this.utilsService
      .getWindowClickEvent()
      .pipe(outsideZone(this.zone))
      .subscribe(() => {
        this.unSelectLastChip();
      });
  }
  ngOnDestroy(): void {
    if (this.windowClickSubscriber) {
      this.windowClickSubscriber.unsubscribe();
    }
  }

  private transmit(change: Partial<ChipInputChange>): void {
    this.transmitValue(this.value, {
      eventType: [InputEventType.onChange, InputEventType.onBlur],
      addToEventObj: change
    });
  }

  private updatePossibleChips(): void {
    this.possibleChips = this.options
      ? this.options.filter(ch =>
          this.value
            ? !this.value.find(c => c.toLowerCase() === ch.toLowerCase())
            : true
        )
      : [];
  }

  private findChip(name: string, chipsSource = this.possibleChips): string {
    return (
      chipsSource &&
      chipsSource.find(chip => chip.toLowerCase() === name.toLowerCase())
    );
  }

  private removeChip(name: string, chipsSource = this.possibleChips): string[] {
    return (
      chipsSource &&
      chipsSource.filter(chip => chip.toLowerCase() !== name.toLowerCase())
    );
  }

  private filterChips(
    name: string,
    chipsSource = this.possibleChips
  ): string[] {
    const filtered = chipsSource.filter(
      chip => chip.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
    return filtered.length > 0 && filtered;
  }

  private commitChip(chipToAdd: string): void {
    if (chipToAdd && !this.findChip(chipToAdd, this.value)) {
      this.value = this.value.concat(chipToAdd);
      this.updatePossibleChips();
      this.transmit({ added: chipToAdd });
      this.input.nativeElement.value = '';
    } else if (chipToAdd) {
      const existingChipElemnent = this.chips.list
        .toArray()
        .find(
          ch =>
            ch.chip.nativeElement.textContent.trim().toLowerCase() ===
            chipToAdd.toLowerCase()
        ).chip.nativeElement;
      if (existingChipElemnent) {
        existingChipElemnent.classList.add('blink');
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            existingChipElemnent.classList.remove('blink');
          }, 200);
        });
        this.input.nativeElement.value = this.input.nativeElement.value.replace(
          /,/g,
          ''
        );
      }
    }
  }

  public onInputChange(event: any): void {
    this.filteredChips =
      this.filterChips(event.target.value) || this.possibleChips;
  }

  public optionSelected(event: MatAutocompleteSelectedEvent): void {
    const chipToAdd = this.findChip(event.option.viewValue);
    this.commitChip(chipToAdd);
  }

  public remove(event: Chip): void {
    const name = event.text;
    this.value = this.removeChip(name, this.value);
    this.updatePossibleChips();
    this.transmit({ removed: name });
    this.autocompleteTrigger.closePanel();
  }

  private unSelectLastChip(): void {
    if (
      this.chips.list.last &&
      this.chips.list.last.chip.nativeElement.dataset.aboutToDelete
    ) {
      delete this.chips.list.last.chip.nativeElement.dataset.aboutToDelete;
      this.chips.list.last.chip.nativeElement.classList.remove('focused');
    }
  }

  private addChipFromInput(): void {
    const name = this.input.nativeElement.value.replace(/,/g, '').trim();
    if (name) {
      let chipToAdd = this.findChip(name);
      if (!chipToAdd && this.acceptNew) {
        chipToAdd = name;
      }
      this.commitChip(chipToAdd);
    }
  }

  public onAutoClosed(): void {
    this.addChipFromInput();
  }

  public onInputFocus(): void {
    this.inputFocused = true;
  }

  public onInputBlur(): void {
    this.inputFocused = false;
    if (!this.autocompletePanel.isOpen) {
      this.addChipFromInput();
    }
  }

  public onInputKeyup(event: KeyboardEvent): void {
    if (isKey(event.key, Keys.backspace)) {
      if (this.input.nativeElement.value === '' && this.chips.list.last) {
        if (this.chips.list.last.chip.nativeElement.dataset.aboutToDelete) {
          const lastChipName = this.value.slice(-1)[0];
          this.value = this.value.slice(0, -1);
          this.updatePossibleChips();
          this.transmit({ removed: lastChipName });
        } else {
          this.chips.list.last.chip.nativeElement.classList.add('focused');
          this.chips.list.last.chip.nativeElement.dataset.aboutToDelete =
            'true';
        }
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.input.nativeElement.focus();
            this.autocompleteTrigger.closePanel();
          }, 0);
        });
      }
    } else if (isKey(event.key, Keys.enter) || isKey(event.key, Keys.comma)) {
      this.addChipFromInput();
      this.autocompleteTrigger.closePanel();
    } else {
      this.unSelectLastChip();
    }
  }

  public onInputKeydown(event: KeyboardEvent): void {
    if (isKey(event.key, Keys.enter)) {
      event.preventDefault();
    }
  }
}
