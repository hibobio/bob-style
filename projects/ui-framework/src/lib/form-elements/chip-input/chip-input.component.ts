import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  forwardRef,
  OnInit,
  SimpleChanges,
  OnChanges,
  HostListener,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList
} from '@angular/core';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete
} from '@angular/material';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { ChipType } from '../../buttons-indicators/chip/chip.enum';
import { ChipInputChange } from './chip-input.interface';
import { InputTypes } from '../input/input.enum';
import { ChipComponent } from '../../buttons-indicators/chip/chip.component';
import { isKey } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { InputEventType } from '../form-elements.enum';
import { arrayOrFail } from '../../services/utils/transformers';

@Component({
  selector: 'b-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['../input/input.component.scss', './chip-input.component.scss'],
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
  ]
})
export class ChipInputComponent extends BaseFormElement
  implements OnChanges, OnInit {
  constructor() {
    super();
    this.inputTransformers = [arrayOrFail];
    this.baseValue = [];
  }

  @Input() value: string[] = [];
  @Input() options: string[] = [];
  @Input() acceptNew = true;

  private possibleChips: string[] = [];
  public filteredChips: string[] = this.options;
  public readonly removable = true;
  public readonly chipType = ChipType;
  public readonly inputTypes = InputTypes;
  readonly addOnBlur = true;

  @ViewChild('input') private input: ElementRef<HTMLInputElement>;
  @ViewChildren('chipList') private chipList: QueryList<ChipComponent>;
  @ViewChild('input', { read: MatAutocompleteTrigger })
  private autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('auto')
  private autocompletePanel: MatAutocomplete;

  @Output() changed: EventEmitter<ChipInputChange> = new EventEmitter<
    ChipInputChange
  >();

  @HostListener('document:click') handleDocClick() {
    this.unSelectLastChip();
  }

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
      this.value.push(chipToAdd);
      this.updatePossibleChips();
      this.transmit({ added: chipToAdd });
      this.input.nativeElement.value = '';
    } else if (chipToAdd) {
      const existingChipElemnent = this.chipList
        .toArray()
        .find(
          ch =>
            ch.chip.nativeElement.textContent.trim().toLowerCase() ===
            chipToAdd.toLowerCase()
        ).chip.nativeElement;
      if (existingChipElemnent) {
        existingChipElemnent.classList.add('blink');
        setTimeout(() => {
          existingChipElemnent.classList.remove('blink');
        }, 200);
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

  public remove(name: string): void {
    this.value = this.removeChip(name, this.value);
    this.updatePossibleChips();
    this.transmit({ removed: name });
    this.autocompleteTrigger.closePanel();
  }

  private unSelectLastChip(): void {
    if (
      this.chipList.last &&
      this.chipList.last.chip.nativeElement.dataset.aboutToDelete
    ) {
      delete this.chipList.last.chip.nativeElement.dataset.aboutToDelete;
      this.chipList.last.chip.nativeElement.classList.remove('selected');
    }
  }

  private addChipFromInputEvent(event): void {
    const name = (event.target as HTMLInputElement).value
      .replace(/,/g, '')
      .trim();
    if (name) {
      let chipToAdd = this.findChip(name);
      if (!chipToAdd && this.acceptNew) {
        chipToAdd = name;
      }
      this.commitChip(chipToAdd);
    }
    this.autocompleteTrigger.closePanel();
  }

  public onInputFocus(): void {
    this.inputFocused = true;
  }

  public onInputBlur(event): void {
    this.inputFocused = false;
    if (this.addOnBlur && !this.autocompletePanel.isOpen) {
      this.addChipFromInputEvent(event);
    }
  }

  public onInputKeyup(event: KeyboardEvent): void {
    if (isKey(event.key, Keys.backspace)) {
      if (this.input.nativeElement.value === '' && this.chipList.last) {
        if (this.chipList.last.chip.nativeElement.dataset.aboutToDelete) {
          this.value.pop();
          this.updatePossibleChips();
        } else {
          this.chipList.last.chip.nativeElement.classList.add('selected');
          this.chipList.last.chip.nativeElement.dataset.aboutToDelete = 'true';
        }

        setTimeout(() => {
          this.input.nativeElement.focus();
          this.autocompleteTrigger.closePanel();
        }, 0);
      }
    } else if (isKey(event.key, Keys.enter) || isKey(event.key, Keys.comma)) {
      this.addChipFromInputEvent(event);
    } else {
      this.unSelectLastChip();
    }
  }

  public onInputKeydown(event: KeyboardEvent): void {
    if (isKey(event.key, Keys.enter)) {
      event.preventDefault();
    }
  }

  public onChipKeydown(event: KeyboardEvent): void {
    if (isKey(event.key, Keys.backspace) || isKey(event.key, Keys.delete)) {
      this.remove((event.target as HTMLElement).innerText);
    }
    if (isKey(event.key, Keys.arrowleft)) {
      const prevChip = (event.target as HTMLElement)
        .previousSibling as HTMLElement;
      if (prevChip.nodeName === 'B-CHIP') {
        prevChip.focus();
      }
    }
    if (isKey(event.key, Keys.arrowright)) {
      const nextChip = (event.target as HTMLElement).nextSibling as HTMLElement;
      if (nextChip.nodeName === 'B-CHIP') {
        nextChip.focus();
      }
    }
  }
}
