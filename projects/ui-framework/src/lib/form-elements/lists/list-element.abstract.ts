import { AfterViewInit, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { ListHeader, ListOption } from './list.interface';
import find from 'lodash/find';
import { LIST_EL_HEIGHT } from './list.consts';
import { ListKeyboardService, NavigationKeys } from './list-service/list-keyboard.service';

export abstract class BaseListElement implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('vScroll') vScroll: CdkVirtualScrollViewport;
  @ViewChild('headers') headers;

  noGroupHeaders;
  focusOption: ListOption;
  listOptions: ListOption[];
  listHeaders: ListHeader[];
  maxHeight: number;

  readonly listElHeight = LIST_EL_HEIGHT;

  focusIndex: number;
  private keyDownSubscriber: Subscription;

  protected constructor(
    private renderer: Renderer2,
    private listKeyboardService: ListKeyboardService,
  ) {
  }

  ngOnInit(): void {
    this.focusIndex = -1;
    this.keyDownSubscriber = this.listKeyboardService.getKeyboardNavigationObservable()
      .subscribe((e: KeyboardEvent) => {
        switch (e.code) {
          case(NavigationKeys.down):
            this.focusIndex = this.listKeyboardService
              .getNextFocusIndex(NavigationKeys.down, this.focusIndex, this.listOptions.length);
            this.focusOption = this.listOptions[this.focusIndex];
            this.vScroll.scrollToIndex(this.listKeyboardService.getScrollToIndex(this.focusIndex, this.maxHeight));
            break;
          case(NavigationKeys.up):
            this.focusIndex = this.listKeyboardService
              .getNextFocusIndex(NavigationKeys.up, this.focusIndex, this.listOptions.length);
            this.focusOption = this.listOptions[this.focusIndex];
            this.vScroll.scrollToIndex(this.listKeyboardService
              .getScrollToIndex(this.focusIndex, this.maxHeight));
            break;
          case(NavigationKeys.enter):
            this.focusOption.isPlaceHolder
              ? this.headerClick(find(this.listHeaders, { groupName: this.focusOption.groupName }))
              : this.optionClick(this.focusOption);
            break;
          default:
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this.keyDownSubscriber.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (!this.noGroupHeaders) {
      this.renderer.insertBefore(
        this.vScroll.elementRef.nativeElement,
        this.headers.nativeElement,
        this.vScroll.elementRef.nativeElement.firstChild,
      );
    }
  }

  optionClick(option: ListOption): void {
  }

  headerClick(header: ListHeader): void {
  }
}
