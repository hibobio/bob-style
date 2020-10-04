import {
  Directive,
  OnInit,
  Input,
  NgModule,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MutationObservableService } from './mutation-observable';
import { Subscription } from 'rxjs';
import { isFunction, pass } from './functional-utils';
import { delay } from 'rxjs/operators';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[inView]',
})
export class InViewDirective implements OnInit, OnDestroy {
  constructor(
    private hostRef: ElementRef,
    private mutationObservableService: MutationObservableService
  ) {}

  @Input('inView') onInView: (
    elmnt?: HTMLElement,
    entry?: IntersectionObserverEntry
  ) => any;
  // tslint:disable-next-line: no-input-rename
  @Input('outOfView') onOutOfView: (
    elmnt?: HTMLElement,
    entry?: IntersectionObserverEntry
  ) => any;
  // tslint:disable-next-line: no-input-rename
  @Input('delay') delayEmit: number;

  private inViewSub: Subscription;

  ngOnInit(): void {
    this.inViewSub = this.mutationObservableService
      .getIntersectionObservable(this.hostRef.nativeElement)
      .pipe(this.delayEmit > 0 ? delay(this.delayEmit) : pass)
      .subscribe((entry) => {
        if (entry.isIntersecting && isFunction(this.onInView)) {
          this.onInView(this.hostRef.nativeElement, entry);
        }
        if (!entry.isIntersecting && isFunction(this.onOutOfView)) {
          this.onOutOfView(this.hostRef.nativeElement, entry);
        }
      });
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
