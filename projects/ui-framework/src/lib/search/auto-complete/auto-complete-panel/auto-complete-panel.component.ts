import { has } from 'lodash';
import { Subscription } from 'rxjs';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { Keys } from '../../../enums';
import { FormElementSize } from '../../../form-elements/form-elements.enum';
import { ListKeyboardService } from '../../../lists/list-service/list-keyboard.service';
import { LIST_EL_HEIGHT, LIST_MAX_ITEMS } from '../../../lists/list.consts';
import { getEventPath } from '../../../services/utils/functional-utils';
import { DOMKeyboardEvent } from '../../../types';
import { SearchComponent } from '../../search/search.component';
import { AutoCompleteOption } from '../auto-complete.interface';

@Component({
  selector: 'b-auto-complete-panel',
  templateUrl: './auto-complete-panel.component.html',
  styleUrls: ['./auto-complete-panel.component.scss'],
})
export class AutoCompletePanelComponent
  implements OnChanges, OnInit, OnDestroy {
  @ViewChild('vScroll') vScroll: CdkVirtualScrollViewport;

  @Input() options: AutoCompleteOption[];
  @Input() searchInput: SearchComponent;

  @Input() searchValue: string;
  @Output()
  optionSelect: EventEmitter<AutoCompleteOption> = new EventEmitter();
  @Output() escapeClick: EventEmitter<void> = new EventEmitter();

  readonly listElHeight = LIST_EL_HEIGHT;
  readonly maxHeight = LIST_EL_HEIGHT * LIST_MAX_ITEMS;
  focusIndex: number;
  focusOption: AutoCompleteOption;
  private keyDownSubscriber: Subscription;

  constructor(
    private listKeyboardService: ListKeyboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'options')) {
      this.options = changes.options.currentValue;
      this.updateList();
    }
  }

  ngOnInit(): void {
    this.keyDownSubscriber = this.listKeyboardService
      .getKeyboardNavigationObservable()
      .subscribe((e: DOMKeyboardEvent) => {
        if (
          this.searchInput &&
          !getEventPath(e).includes(this.searchInput.input.nativeElement)
        ) {
          return;
        }

        switch (e.key) {
          case Keys.arrowdown:
            e.preventDefault();
            this.focusIndex = this.listKeyboardService.getNextFocusIndex(
              Keys.arrowdown,
              this.focusIndex,
              this.options.length
            );
            this.focusOption = this.options[this.focusIndex];
            this.vScroll.scrollToIndex(
              this.listKeyboardService.getScrollToIndex({
                focusIndex: this.focusIndex,
                listHeight: this.maxHeight,
                size: FormElementSize.regular,
              })
            );
            if (!this.cd['destroyed']) {
              this.cd.detectChanges();
            }
            break;
          case Keys.arrowup:
            e.preventDefault();
            this.focusIndex = this.listKeyboardService.getNextFocusIndex(
              Keys.arrowup,
              this.focusIndex,
              this.options.length
            );
            this.focusOption = this.options[this.focusIndex];
            this.vScroll.scrollToIndex(
              this.listKeyboardService.getScrollToIndex({
                focusIndex: this.focusIndex,
                listHeight: this.maxHeight,
                size: FormElementSize.regular,
              })
            );
            if (!this.cd['destroyed']) {
              this.cd.detectChanges();
            }
            break;
          case Keys.enter:
            e.preventDefault();
            if (this.focusOption) {
              this.optionClick(this.focusOption);
            }
            break;
          case Keys.escape:
            this.escapeClick.emit();
            break;
          default:
            break;
        }
      });
  }

  optionClick(option: AutoCompleteOption): void {
    if (option && this.optionSelect.observers) {
      this.optionSelect.emit(option);
    }
  }

  ngOnDestroy(): void {
    if (this.keyDownSubscriber) {
      this.keyDownSubscriber.unsubscribe();
    }
  }

  private updateList(): void {
    this.focusIndex = 0;
    this.focusOption = this.options[this.focusIndex];
  }
}
