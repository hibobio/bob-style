import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';

import { mockImage } from '../../mock.const';
import { InputObservable } from '../../services/utils/decorators';
import { randomNumber } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-masonry-test-card',
  template: `
    <div>
      <h3>{{ title$ | async }}</h3>
      <div *ngIf="dice">
        <img #imgEl [src]="img$ | async" loading="lazy" />
      </div>
      <p>{{ text$ | async }}</p>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 16px;
        border: 1px solid grey;
        box-sizing: border-box;
      }
      h3 {
        margin-top: 0;
      }
      h3 + p {
        margin: 0;
      }
      div + p {
        margin-top: 8px;
        margin-bottom: 0;
      }
      img {
        display: block;
        border: 0;
        width: 100%;
        height: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasonryTestComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @InputObservable(undefined)
  @Input('card')
  public card$: Observable<{ title: string; text: string }>;

  @ViewChild('imgEl') imgEl: ElementRef<HTMLImageElement>;

  title$: Observable<string>;
  text$: Observable<string>;
  img$: Observable<string>;

  dice = randomNumber() > 60;

  makeImageSrc() {
    return mockImage(randomNumber(400, 600), randomNumber(400, 600));
  }

  ngOnInit(): void {
    this.title$ = this.card$.pipe(map((card) => card?.title));
    this.text$ = this.card$.pipe(
      delay(randomNumber() > 50 ? 0 : randomNumber(300, 1500)),
      map((card) => card?.text)
    );
    this.img$ = of(this.makeImageSrc()).pipe(
      delay(randomNumber(500, 2000)),
      tap(() => {
        const imageEl = this.imgEl?.nativeElement;

        if (imageEl) {
          imageEl.addEventListener('load', () => {
            imageEl.setAttribute('data-loaded', 'true');
          });
          imageEl.addEventListener('error', () => {
            imageEl.setAttribute('src', this.makeImageSrc());
          });
        }
      })
    );
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [MasonryTestComponent],
  exports: [MasonryTestComponent],
})
export class MasonryTestModule {}
