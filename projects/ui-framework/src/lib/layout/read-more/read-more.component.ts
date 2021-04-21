import { BehaviorSubject, merge, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
} from 'rxjs/operators';

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { InputObservable } from '../../services/utils/decorators';
import { MutationObservableService } from '../../services/utils/mutation-observable';
import { insideZone } from '../../services/utils/rxjs.operators';

@Component({
  selector: 'b-read-more, [readMore]',
  template: `
    <div
      #textContainer
      [attr.data-max-lines]="!(complete$ | async) && maxLines ? maxLines : null"
    >
      <span *ngIf="text$ | async as text" [innerHTML]="text"></span>
      <ng-content></ng-content>
    </div>
    <a *ngIf="hasReadMore$ | async" class="b-link" (click)="showMore()"
      >View More</a
    >
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
    `,
  ],
})
export class ReadMoreComponent implements OnInit, OnDestroy {
  constructor(
    private hostElRef: ElementRef<HTMLElement>,
    private mutationObservableService: MutationObservableService,
    private DOM: DOMhelpers,
    private zone: NgZone
  ) {}

  @ViewChild('textContainer', { static: true })
  private textContainer: ElementRef<HTMLElement>;

  @InputObservable(null, [filter(Boolean)])
  @Input('readMore')
  text$: Observable<string>;

  @Input() maxLines: number;

  @Output() clicked = new EventEmitter<void>();

  readonly complete$ = new BehaviorSubject<boolean>(false);
  readonly hasReadMore$ = new BehaviorSubject<boolean>(true);

  showMore() {
    if (this.clicked.observers.length) {
      this.clicked.emit();
    } else {
      this.hasReadMore$.next(false);
      this.ngOnDestroy();
    }
  }

  ngOnInit() {
    const { lineHeightPx } = this.DOM.getElementTextProps(
      this.textContainer.nativeElement
    );

    merge(
      this.text$,
      this.mutationObservableService
        .getMutationObservable(this.textContainer.nativeElement, {
          attributes: false,
          characterData: true,
          childList: true,
          subtree: true,
          removedElements: true,
          outsideZone: true,
        })
        .pipe(takeUntil(this.text$)),
      this.mutationObservableService.getResizeObservervable(
        this.hostElRef.nativeElement,
        {
          watch: 'both',
          debounceTime: true,
          outsideZone: true,
        }
      )
    )
      .pipe(
        takeUntil(this.complete$.pipe(filter(Boolean))),
        debounceTime(50),
        map(() => {
          const scrollHeight = this.textContainer.nativeElement.scrollHeight;
          const offsetHeight = this.textContainer.nativeElement.offsetHeight;

          return Boolean(
            scrollHeight > offsetHeight ||
              (this.maxLines &&
                offsetHeight > this.maxLines * (lineHeightPx || 12 * 1.5))
          );
        }),
        distinctUntilChanged(),
        insideZone(this.zone)
      )
      .subscribe(this.hasReadMore$);
  }

  ngOnDestroy() {
    this.complete$.next(true);
    this.complete$.complete();
    this.hasReadMore$.complete();
  }
}
