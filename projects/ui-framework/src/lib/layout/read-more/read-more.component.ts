import { BehaviorSubject, merge, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';

import {
  ChangeDetectorRef,
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
import { SafeHtml } from '@angular/platform-browser';

import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { HtmlParserHelpers } from '../../services/html/html-parser.service';
import {
  FilterXSSOptions,
  SANITIZER_ALLOWED_ATTRS,
  SANITIZER_FILTER_XSS_OPTIONS,
  SanitizerService,
} from '../../services/html/sanitizer.service';
import { InputObservable } from '../../services/utils/decorators';
import {
  chainCall,
  objectRemoveKeys,
} from '../../services/utils/functional-utils';
import { MutationObservableService } from '../../services/utils/mutation-observable';
import { insideZone } from '../../services/utils/rxjs.operators';

export const READMORE_SANITIZER_OPTIONS: Partial<FilterXSSOptions> = {
  whiteList: {
    ...objectRemoveKeys(SANITIZER_FILTER_XSS_OPTIONS.whiteList, [
      'div',
      'p',
      'br',
    ]),
    a: SANITIZER_ALLOWED_ATTRS.filter((a) => a !== 'style'),
  },
  css: {
    whiteList: {
      ...objectRemoveKeys(SANITIZER_FILTER_XSS_OPTIONS.css['whiteList'], [
        'font-size',
      ]),
      'font-size': false,
    },
  },
  stripIgnoreTagBody: false,
};

@Component({
  selector: 'b-read-more, [readMore]',
  template: `
    <div
      #textContainer
      class="text-container"
      [attr.data-max-lines]="!(complete$ | async) && maxLines ? maxLines : null"
    >
      <span *ngIf="textView$ | async as text" [innerHTML]="text"></span>
      <ng-content></ng-content>
    </div>
    <a
      *ngIf="hasReadMore$ | async"
      class="b-link"
      [hidden]="!ready"
      (click)="showMore()"
      >{{ linkText || ('common.view-more' | translate) }}</a
    >
  `,
  styleUrls: ['./read-more.component.scss'],
})
export class ReadMoreComponent implements OnInit, OnDestroy {
  constructor(
    private hostElRef: ElementRef<HTMLElement>,
    private mutationObservableService: MutationObservableService,
    private DOM: DOMhelpers,
    private parser: HtmlParserHelpers,
    private sanitizer: SanitizerService,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChild('textContainer', { static: true })
  private textContainer: ElementRef<HTMLElement>;

  @InputObservable(null, [filter(Boolean)])
  @Input('readMore')
  text$: Observable<string>;

  @Input() maxLines: number;
  @Input() linkText: string;

  @Output() clicked = new EventEmitter<void>();

  public textView$: Observable<SafeHtml>;
  readonly complete$ = new BehaviorSubject<boolean>(false);
  readonly hasReadMore$ = new BehaviorSubject<boolean>(true);
  public ready = false;

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

    this.textView$ = this.text$.pipe(
      distinctUntilChanged(),
      map(
        (text): SafeHtml =>
          chainCall(
            [
              (txt) => this.parser.cleanupHtml(txt),
              (txt) => this.parser.linkify(txt, 'rel="noopener noreferrer"'),
              (txt) =>
                this.parser.enforceAttributes(
                  txt,
                  {
                    a: {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    },
                    '[href*="/employee-profile/"]': {
                      target: null,
                      rel: null,
                    },
                  },
                  false
                ),
              (txt) =>
                this.sanitizer.filterXSS(txt, READMORE_SANITIZER_OPTIONS),
              (txt) => this.sanitizer.bypassSecurity(txt),
            ],
            text
          )
      )
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
        tap(() => {
          this.ready = true;
          this.cd.detectChanges();
        }),
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
