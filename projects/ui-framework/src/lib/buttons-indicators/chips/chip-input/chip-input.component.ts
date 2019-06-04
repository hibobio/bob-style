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
  MatAutocompleteTrigger
} from '@angular/material';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { BaseFormElement } from '../../../form-elements/base-form-element';
import { ChipType } from '../chips.enum';
import { ChipInputChange } from '../chips.interface';
import { InputTypes } from '../../../form-elements/input/input.enum';
import { ChipComponent } from '../chip/chip.component';
import { keyIs } from '../../../services/utils/functional-utils';
import { Keys } from '../../../enums';

@Component({
  selector: 'b-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: [
    '../../../form-elements/input/input.component.scss',
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
  ]
})
export class ChipInputComponent extends BaseFormElement
  implements OnChanges, OnInit {
  constructor() {
    super();
  }

  @Input() value: string[] = [];
  @Input() options: string[];
  @Input() acceptNew = true;

  private possibleChips: string[] = [];
  public filteredChips: string[] = this.options;
  public readonly removable = true;
  public readonly chipType = ChipType;
  public readonly inputTypes = InputTypes;

  @ViewChild('bInput') private bInput: ElementRef<HTMLInputElement>;
  @ViewChildren('chipList') private chipList: QueryList<ChipComponent>;
  @ViewChild('bInput', { read: MatAutocompleteTrigger })
  private autocompleteTrigger: MatAutocompleteTrigger;

  @Output() changed: EventEmitter<ChipInputChange> = new EventEmitter<
    ChipInputChange
  >();

  @HostListener('document:click', ['event']) handleDocClick(event: MouseEvent) {
    this.unSelectLastChip();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && !changes.value.firstChange) {
      this.value = changes.value.currentValue;
      this.updatePossibleChips();
    }
    if (changes.options && !changes.options.firstChange) {
      this.options = changes.options.currentValue;
      this.updatePossibleChips();
    }
  }

  ngOnInit(): void {
    this.updatePossibleChips();
  }

  private propagateValue(change: Partial<ChipInputChange>): void {
    this.propagateChange(this.value);
    this.changed.emit({ ...change, value: this.value });
    this.onTouched();
  }

  private updatePossibleChips(): void {
    this.possibleChips = this.options.filter(
      ch => !this.value.find(c => c.toLowerCase() === ch.toLowerCase())
    );
  }

  private findChip(name: string, chipsSource = this.possibleChips): string {
    return chipsSource.find(chip => chip.toLowerCase() === name.toLowerCase());
  }

  private removeChip(name: string, chipsSource = this.possibleChips): string[] {
    return chipsSource.filter(
      chip => chip.toLowerCase() !== name.toLowerCase()
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
      this.propagateValue({ added: chipToAdd });
      this.bInput.nativeElement.value = '';
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
        this.bInput.nativeElement.value = this.bInput.nativeElement.value.replace(
          /,/g,
          ''
        );
      }
    }
  }

  public onInput(event: any): void {
    this.filteredChips =
      this.filterChips(event.target.value) || this.possibleChips;
  }

  public add(name: string): void {
    let chipToAdd = this.findChip(name);
    if (!chipToAdd && this.acceptNew) {
      chipToAdd = name;
    }
    this.commitChip(chipToAdd);
    this.autocompleteTrigger.closePanel();
  }

  public optionSelected(event: MatAutocompleteSelectedEvent): void {
    const chipToAdd = this.findChip(event.option.viewValue);
    this.commitChip(chipToAdd);
  }

  public remove(name: string): void {
    this.value = this.removeChip(name, this.value);
    this.updatePossibleChips();
    this.propagateValue({ removed: name });
    this.autocompleteTrigger.closePanel();
  }

  private unSelectLastChip(): void {
    if (this.chipList.last.chip.nativeElement.dataset.aboutToDelete) {
      delete this.chipList.last.chip.nativeElement.dataset.aboutToDelete;
      this.chipList.last.chip.nativeElement.classList.remove('selected');
    }
  }

  public onInputKeyup(event: KeyboardEvent): void {
    if (keyIs(event.key, Keys.backspace)) {
      if (this.bInput.nativeElement.value === '' && this.chipList.last) {
        if (this.chipList.last.chip.nativeElement.dataset.aboutToDelete) {
          this.value.pop();
          this.updatePossibleChips();
        } else {
          this.chipList.last.chip.nativeElement.classList.add('selected');
          this.chipList.last.chip.nativeElement.dataset.aboutToDelete = 'true';
        }

        setTimeout(() => {
          this.bInput.nativeElement.focus();
          this.autocompleteTrigger.closePanel();
        }, 0);
      }
    } else if (keyIs(event.key, Keys.enter) || keyIs(event.key, Keys.comma)) {
      const name = (event.target as HTMLInputElement).value
        .replace(/,/g, '')
        .trim();
      if (name) {
        this.add(name);
      }
    } else {
      this.unSelectLastChip();
    }
  }

  public onChipKeydown(event: KeyboardEvent): void {
    if (keyIs(event.key, Keys.backspace) || keyIs(event.key, Keys.delete)) {
      this.remove((event.target as HTMLElement).innerText);
    }
    if (keyIs(event.key, Keys.arrowleft)) {
      const prevChip = (event.target as HTMLElement)
        .previousSibling as HTMLElement;
      if (prevChip.nodeName === 'B-CHIP') {
        prevChip.focus();
      }
    }
    if (keyIs(event.key, Keys.arrowright)) {
      const nextChip = (event.target as HTMLElement).nextSibling as HTMLElement;
      if (nextChip.nodeName === 'B-CHIP') {
        nextChip.focus();
      }
    }
  }
}
