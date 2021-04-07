import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import {
  IntersectionObservableConfig,
  MutationObservableService,
} from './mutation-observable';

export const IN_VIEW_DIR_CONFIG_DEF: IntersectionObservableConfig = {
  threshold: 0.25,
  debounceTime: false,
};

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[inView]',
})
export class InViewDirective implements OnInit, OnDestroy {
  constructor(
    private hostRef: ElementRef,
    private mutationObservableService: MutationObservableService
  ) {}

  // tslint:disable-next-line: no-input-rename
  @Input('inViewConfig') config: IntersectionObservableConfig;

  @Output('inView') isInView: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  private inViewSub: Subscription;

  ngOnInit(): void {
    this.inViewSub = this.mutationObservableService
      .getElementInViewEvent(this.hostRef.nativeElement, {
        ...IN_VIEW_DIR_CONFIG_DEF,
        ...this.config,
      })
      .subscribe(this.isInView);
  }

  ngOnDestroy(): void {
    this.inViewSub?.unsubscribe();
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [InViewDirective],
  exports: [InViewDirective],
  providers: [],
})
export class InViewModule {}
