import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { LIST_EL_HEIGHT } from '../../../form-elements/lists/list.consts';
import { AutoCompleteOption } from '../auto-complete.interface';
import { has } from 'lodash';
import { Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ListKeyboardService } from '../../../form-elements/lists/list-service/list-keyboard.service';
import { Keys } from '../../../enums';

@Component({
  selector: 'b-auto-complete-panel',
  templateUrl: './auto-complete-panel.component.html',
  styleUrls: ['./auto-complete-panel.component.scss']
})
export class AutoCompletePanelComponent
  implements OnChanges, OnInit, OnDestroy {
  @ViewChild('vScroll', { static: false }) vScroll: CdkVirtualScrollViewport;

  @Input() options: AutoCompleteOption[];
  @Input() searchValue: string;
  @Output() optionSelect: EventEmitter<AutoCompleteOption> = new EventEmitter<
    AutoCompleteOption
  >();
  @Output() escapeClick: EventEmitter<void> = new EventEmitter<void>();

  readonly listElHeight = LIST_EL_HEIGHT;
  readonly maxHeight = this.listElHeight * 8;
  focusIndex: number;
  focusOption: AutoCompleteOption;
  private keyDownSubscriber: Subscription;

  constructor(private listKeyboardService: ListKeyboardService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'options')) {
      this.options = changes.options.currentValue;
      this.updateList();
    }
  }

  ngOnInit(): void {
    this.keyDownSubscriber = this.listKeyboardService
      .getKeyboardNavigationObservable()
      .subscribe((e: KeyboardEvent) => {
        switch (e.key) {
          case Keys.arrowdown:
            this.focusIndex = this.listKeyboardService.getNextFocusIndex(
              Keys.arrowdown,
              this.focusIndex,
              this.options.length
            );
            this.focusOption = this.options[this.focusIndex];
            this.vScroll.scrollToIndex(
              this.listKeyboardService.getScrollToIndex(
                this.focusIndex,
                this.maxHeight
              )
            );
            break;
          case Keys.arrowup:
            this.focusIndex = this.listKeyboardService.getNextFocusIndex(
              Keys.arrowup,
              this.focusIndex,
              this.options.length
            );
            this.focusOption = this.options[this.focusIndex];
            this.vScroll.scrollToIndex(
              this.listKeyboardService.getScrollToIndex(
                this.focusIndex,
                this.maxHeight
              )
            );
            break;
          case Keys.enter:
            this.optionClick(this.focusOption);
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
    this.optionSelect.emit(option);
  }

  ngOnDestroy(): void {
    this.keyDownSubscriber.unsubscribe();
  }

  private updateList(): void {
    this.focusIndex = 0;
    this.focusOption = this.options[this.focusIndex];
  }
}
