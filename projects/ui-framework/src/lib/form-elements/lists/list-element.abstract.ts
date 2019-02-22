import { AfterViewInit, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ListHeader, ListOption } from './list.interface';
import find from 'lodash/find';
import { LIST_EL_HEIGHT } from './list.consts';

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
  ) {
  }

  ngOnInit(): void {
    this.focusIndex = -1;
    let scrollToIndex;
    this.keyDownSubscriber = fromEvent(document, 'keydown')
      .pipe(filter((e: KeyboardEvent) => e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'Enter'))
      .subscribe((e: KeyboardEvent) => {
        switch (e.code) {
          case('ArrowDown'):
            this.focusIndex = (this.focusIndex + 1) % this.listOptions.length;
            this.focusOption = this.listOptions[this.focusIndex];
            scrollToIndex = this.focusIndex - (this.maxHeight / this.listElHeight) + 2;
            this.vScroll.scrollToIndex(scrollToIndex);
            break;
          case('ArrowUp'):
            this.focusIndex = (this.focusIndex - 1) > -1 ? this.focusIndex - 1 : this.listOptions.length - 1;
            this.focusOption = this.listOptions[this.focusIndex];
            scrollToIndex = this.focusIndex - (this.maxHeight / this.listElHeight) + 2;
            this.vScroll.scrollToIndex(scrollToIndex);
            break;
          case('Enter'):
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
