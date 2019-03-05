import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { LIST_EL_HEIGHT } from '../../../form-elements/lists/list.consts';
import { AutoCompleteOption } from '../auto-complete.interface';
import { has, escapeRegExp, compact, filter } from 'lodash';

@Component({
  selector: 'b-auto-complete-panel',
  templateUrl: './auto-complete-panel.component.html',
  styleUrls: ['./auto-complete-panel.component.scss'],
})
export class AutoCompletePanelComponent implements OnChanges {

  @Input() options: AutoCompleteOption[];
  @Input() searchValue: string;
  @Output() optionSelect: EventEmitter<AutoCompleteOption> = new EventEmitter<AutoCompleteOption>();

  readonly listElHeight = LIST_EL_HEIGHT;

  filteredOptions: AutoCompleteOption[];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.shouldResetModel(changes)) {
      this.options = changes.options.currentValue;
      this.updateList();
    }
    if (has(changes, 'searchValue')) {
      this.searchValue = changes.searchValue.currentValue;
      this.updateList();
    }
  }

  private shouldResetModel(changes: SimpleChanges): boolean {
    return has(changes, 'options');
  }

  private updateList(): void {
    const matcher = new RegExp(escapeRegExp(this.searchValue), 'i');
    this.filteredOptions = filter(this.options, option => option.value.match(matcher) || option.subText.match(matcher));
  }

  optionClick(option: AutoCompleteOption): void {
    this.optionSelect.emit(option);
  }
}
