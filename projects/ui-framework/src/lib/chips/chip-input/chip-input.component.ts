import {
  Component,
  Input,
  ViewChild,
  forwardRef,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { ChipType } from '../chips.enum';
import { ChipInputChange, ChipListConfig, Chip } from '../chips.interface';
import { isKey, isRegExp } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { InputEventType } from '../../form-elements/form-elements.enum';
import { arrayOrFail } from '../../services/utils/transformers';
import { ChipListComponent } from '../chip-list/chip-list.component';
import { UtilsService } from '../../services/utils/utils.service';
import { Subscription } from 'rxjs';
import { ChipInputValidation, CHIP_INPUT_VALIDATION } from './chip-input.const';

@Component({
  selector: 'b-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    './chip-input.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: ChipInputComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipInputComponent extends BaseFormElement
  implements OnInit, OnDestroy {
  constructor(
    protected cd: ChangeDetectorRef,
    private utilsService: UtilsService,
    private zone: NgZone
  ) {
    super(cd);
    this.inputTransformers = [arrayOrFail];
    this.baseValue = [];
  }

  @Input() value: string[] = [];
  @Input() options: string[] = [];
  @Input() acceptNew = true;
  @Input() maxChars = 50;

  @Input() validation: ChipInputValidation | RegExp;

  @Input() hasFooterAction = false;
  public showSuffix = true;

  private possibleChips: string[] = [];
  public filteredChips: string[] = this.options;

  readonly chipListConfig: ChipListConfig = {
    type: ChipType.tag,
    removable: true,
    focusable: true,
  };

  private ignoreAutoClosedEvent = false;
  private validator: RegExp;

  @ViewChild('chips', { static: true }) public chips: ChipListComponent;
  @ViewChild('input', { read: MatAutocompleteTrigger, static: true })
  private autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('auto', { static: true })
  private autocompletePanel: MatAutocomplete;
  private windowClickSubscriber: Subscription;

  @Output() changed: EventEmitter<ChipInputChange> = new EventEmitter<
    ChipInputChange
  >();

  // extends BaseFormElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (changes.value && !changes.value.firstChange) {
      this.updatePossibleChips();
    }
    if (changes.options && !changes.options.firstChange) {
      this.options = changes.options.currentValue || [];
      this.updatePossibleChips();
    }

    if (changes.validation && this.validation) {
      this.validator = isRegExp(this.validation)
        ? this.validation
        : isRegExp(CHIP_INPUT_VALIDATION[this.validation])
        ? CHIP_INPUT_VALIDATION[this.validation]
        : null;
    }
  }

  ngOnInit(): void {
    this.updatePossibleChips();

    this.windowClickSubscriber = this.utilsService
      .getWindowClickEvent(true)
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
      addToEventObj: change,
    });
  }

  private updatePossibleChips(): void {
    this.possibleChips = this.options
      ? this.options.filter((ch) =>
          this.value
            ? !this.value.find((c) => c.toLowerCase() === ch.toLowerCase())
            : true
        )
      : [];
  }

  private findChip(name: string, chipsSource = this.possibleChips): string {
    return (
      chipsSource &&
      chipsSource.find((chip) => chip.toLowerCase() === name.toLowerCase())
    );
  }

  private removeChip(name: string, chipsSource = this.possibleChips): string[] {
    return (
      chipsSource &&
      chipsSource.filter((chip) => chip.toLowerCase() !== name.toLowerCase())
    );
  }

  private filterChips(
    name: string,
    chipsSource = this.possibleChips
  ): string[] {
    const filtered = chipsSource.filter(
      (chip) => chip.toLowerCase().indexOf(name.toLowerCase()) > -1
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
          (ch) =>
            ch.chip.textContent.trim().toLowerCase() === chipToAdd.toLowerCase()
        ).chip;
      if (existingChipElemnent) {
        existingChipElemnent.classList.add('blink');
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            existingChipElemnent.classList.remove('blink');
          }, 200);
        });
        this.input.nativeElement.value = this.input.nativeElement.value.replace(
          /[,;]/g,
          ''
        );
      }
    }
  }

  public onInputChange(event: any): void {
    this.filteredChips = this.filterChips(event.target.value) || [];
    this.cd.detectChanges();
  }

  public optionSelected(event: MatAutocompleteSelectedEvent): void {
    const chipToAdd = this.findChip(event.option.viewValue);
    this.commitChip(chipToAdd);
  }

  public remove(chip: Chip): void {
    const name = chip.text;
    this.value = this.removeChip(name, this.value);
    this.updatePossibleChips();
    this.transmit({ removed: name });
    this.autocompleteTrigger.closePanel();
    this.cd.detectChanges();
  }

  private unSelectLastChip(): void {
    if (
      this.chips.list.last &&
      this.chips.list.last.chip.dataset.aboutToDelete
    ) {
      delete this.chips.list.last.chip.dataset.aboutToDelete;
      this.chips.list.last.chip.classList.remove('focused');
    }
  }

  private addChipFromInput(): void {
    const name = this.input.nativeElement.value.replace(/[,;]/g, '').trim();
    if (name) {
      let chipToAdd = this.findChip(name);
      if (
        !chipToAdd &&
        this.acceptNew &&
        (!this.validator || this.validator.test(name))
      ) {
        chipToAdd = name;
      }
      this.commitChip(chipToAdd);
    }
  }

  public onAutoClosed(): void {
    if (!this.ignoreAutoClosedEvent) {
      this.addChipFromInput();
    }
    this.ignoreAutoClosedEvent = false;
  }

  public onInputFocus(): void {
    this.inputFocused = true;
    this.cd.detectChanges();
  }

  public onInputBlur(): void {
    this.inputFocused = false;
    if (!this.autocompletePanel.isOpen) {
      this.addChipFromInput();
    }
    this.cd.detectChanges();
  }

  public onInputKeyup(event: KeyboardEvent): void {
    if (isKey(event.key, Keys.backspace)) {
      if (this.input.nativeElement.value === '' && this.chips.list.last) {
        if (this.chips.list.last.chip.dataset.aboutToDelete) {
          const lastChipName = this.value.slice(-1)[0];
          this.zone.run(() => {
            this.value = this.value.slice(0, -1);
            this.updatePossibleChips();
            this.transmit({ removed: lastChipName });
          });
        } else {
          this.chips.list.last.chip.classList.add('focused');
          this.chips.list.last.chip.dataset.aboutToDelete = 'true';
        }
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.input.nativeElement.focus();
            this.autocompleteTrigger.closePanel();
          }, 0);
        });
      }
    } else if (this.isAddChipKeyEvent(event)) {
      this.zone.run(() => {
        this.addChipFromInput();
        this.autocompleteTrigger.closePanel();
      });
    } else {
      this.unSelectLastChip();
    }
  }

  public onInputKeydown(event: KeyboardEvent): void {
    if (this.isAddChipKeyEvent(event)) {
      event.preventDefault();
    }
  }

  private isAddChipKeyEvent(event: KeyboardEvent): boolean {
    return (
      isKey(event.key, Keys.enter) ||
      isKey(event.key, Keys.comma) ||
      isKey(event.key, Keys.semicolon) ||
      Boolean(
        isKey(event.key, Keys.tab) &&
          this.inputFocused &&
          this.input.nativeElement.value.trim()
      )
    );
  }

  public chipsTrackBy(index: number, chip: string): string {
    return chip;
  }
}
