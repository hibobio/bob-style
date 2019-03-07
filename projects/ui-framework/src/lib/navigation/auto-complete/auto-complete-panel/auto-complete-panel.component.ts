import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LIST_EL_HEIGHT } from '../../../form-elements/lists/list.consts';
import { AutoCompleteOption } from '../auto-complete.interface';
import { compact, escapeRegExp, filter as _filter, has, min } from 'lodash';
import { Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ListKeyboardService, NavigationKeys } from '../../../form-elements/lists/list-service/list-keyboard.service';

@Component({
  selector: 'b-auto-complete-panel',
  templateUrl: './auto-complete-panel.component.html',
  styleUrls: ['./auto-complete-panel.component.scss'],
})
export class AutoCompletePanelComponent implements OnChanges, OnInit, OnDestroy {

  @ViewChild('vScroll') vScroll: CdkVirtualScrollViewport;
  @Input() options: AutoCompleteOption[];
  @Input() searchValue: string;
  @Output() optionSelect: EventEmitter<AutoCompleteOption> = new EventEmitter<AutoCompleteOption>();

  readonly listElHeight = LIST_EL_HEIGHT;
  readonly maxHeight = this.listElHeight * 8;
  focusIndex: number;
  filteredOptions: AutoCompleteOption[];
  focusOption: AutoCompleteOption;

  private keyDownSubscriber: Subscription;

  constructor(
    private listKeyboardService: ListKeyboardService,
  ) {
  }

  ngOnInit(): void {
    this.focusIndex = -1;
    this.keyDownSubscriber = this.listKeyboardService.getKeyboardNavigationObservable()
      .subscribe((e: KeyboardEvent) => {
        switch (e.code) {
          case(NavigationKeys.down):
            this.focusIndex = this.listKeyboardService.getFocusIndex(NavigationKeys.down, this.focusIndex, this.filteredOptions.length);
            this.focusOption = this.filteredOptions[this.focusIndex];
            this.vScroll.scrollToIndex(this.listKeyboardService.getScrollToIndex(this.focusIndex, this.maxHeight));
            break;
          case(NavigationKeys.up):
            this.focusIndex = this.listKeyboardService.getFocusIndex(NavigationKeys.up, this.focusIndex, this.filteredOptions.length);
            this.focusOption = this.filteredOptions[this.focusIndex];
            this.vScroll.scrollToIndex(this.listKeyboardService.getScrollToIndex(this.focusIndex, this.maxHeight));
            break;
          case(NavigationKeys.enter):
            this.optionClick(this.focusOption);
            break;
          default:
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this.keyDownSubscriber.unsubscribe();
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
    this.filteredOptions = this.options;
    this.filteredOptions = _filter(this.options, option => option.value.match(matcher) || option.subText.match(matcher));
  }

  private getHeight(): number {
    return min(this.maxHeight, this.listElHeight * this.filteredOptions.length);
  }

  optionClick(option: AutoCompleteOption): void {
    this.optionSelect.emit(option);
  }
}
