import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { InputObservable } from '../../services/utils/decorators';
import { asArray, closestNumber } from '../../services/utils/functional-utils';
import { MutationObservableService } from '../../services/utils/mutation-observable';

const FIT_TEXT_FONT_SIZES = [11, 12, 14, 18, 22, 28, 36, 42];
const FIT_TEXT_SAFETY_GAP = 8;

export enum FitTextFontType {
  body = 'body',
  bodyBold = 'bodyBold',
  display = 'display',
  displayBold = 'displayBold',
}

const FIT_TEXT_CHAR_RATIO_BY_TYPE = {
  [FitTextFontType.body]: 1.35,
  [FitTextFontType.bodyBold]: 1.35,
  [FitTextFontType.display]: 1.35,
  [FitTextFontType.displayBold]: 1.3,
};

const FIT_TEXT_STYLES_BY_TYPE = {
  [FitTextFontType.body]: {
    fontFamily: 'var(--body-font-family)',
    fontWeight: '400',
  },
  [FitTextFontType.bodyBold]: {
    fontFamily: 'var(--body-font-family)',
    fontWeight: '600',
  },
  [FitTextFontType.display]: {
    fontFamily: 'var(--display-font-family)',
    fontWeight: '600',
  },
  [FitTextFontType.displayBold]: {
    fontFamily: 'var(--display-font-family)',
    fontWeight: '900',
  },
};

@Component({
  selector: 'b-fit-text',
  template: `<span
    [ngStyle]="styles[fontType$ | async] || 'display'"
    [style.fontSize]="(fontSize$ | async) + 'px'"
    >{{ text$ | async }}</span
  >`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-self: center;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
        text-align: center;
        white-space: nowrap;
        min-width: 0;
        max-width: 100%;
        width: 100%;
      }
      span {
        will-change: font-size;
        transition: font-size 0.2s;
        line-height: 1;
      }
      :host[data-disable-animation='true'] span {
        transition: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FitTextComponent implements OnInit, OnDestroy {
  constructor(
    private hostElRef: ElementRef<HTMLElement>,
    private mutationObservableService: MutationObservableService
  ) {}

  // tslint:disable-next-line: no-input-rename
  @InputObservable('') @Input('text') text$: Observable<string>;
  // tslint:disable-next-line: no-input-rename
  @InputObservable(null) @Input('syncMin') syncMin$: Observable<
    number | number[]
  >;
  // tslint:disable-next-line: no-input-rename
  @InputObservable(false) @Input('stepped') stepped$: Observable<boolean>;
  // tslint:disable-next-line: no-input-rename
  @InputObservable(FitTextFontType.display)
  @Input('type')
  fontType$: Observable<FitTextFontType>;

  @HostBinding('attr.data-disable-animation') @Input() disableAnimation = false;

  @Output() changed: EventEmitter<number> = new EventEmitter<number>();

  public fontSize$: BehaviorSubject<number> = new BehaviorSubject(0);

  readonly styles = FIT_TEXT_STYLES_BY_TYPE;
  private sub: Subscription;

  ngOnInit() {
    this.sub = combineLatest([
      this.mutationObservableService.getResizeObservervable(
        this.hostElRef.nativeElement,
        { watch: 'width', threshold: 10 }
      ),
      this.text$,
      this.fontType$,
      this.syncMin$,
      this.stepped$,
    ])
      .pipe(
        map(
          ([hostRect, text, fontType, syncMin, stepped]: [
            Partial<DOMRectReadOnly>,
            string,
            FitTextFontType,
            number | number[],
            boolean
          ]) => {
            let fontSize = Math.floor(
              (Math.max(0, hostRect.width - FIT_TEXT_SAFETY_GAP) *
                (FIT_TEXT_CHAR_RATIO_BY_TYPE[fontType] || 1.4)) /
                String(text ?? '').length
            );

            if (stepped) {
              fontSize = closestNumber(fontSize, FIT_TEXT_FONT_SIZES);
            }
            if (syncMin) {
              fontSize = Math.min(
                ...asArray(syncMin).filter(Boolean),
                fontSize
              );
            }

            return fontSize;
          }
        ),
        distinctUntilChanged(),
        tap((fontSize) => {
          this.changed.emit(fontSize);
        })
      )
      .subscribe(this.fontSize$);
  }

  ngOnDestroy(): void {
    this.fontSize$?.complete();
    this.sub?.unsubscribe();
  }
}
