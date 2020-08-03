import {
  NgModule,
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { InputObservable } from '../../services/utils/decorators';
import { map, delay, tap } from 'rxjs/operators';
import { randomNumber } from '../../services/utils/functional-utils';
import { mockImage } from '../../mock.const';

@Component({
  selector: 'b-masonry-test-card',
  template: `
    <div>
      <h3>{{ title$ | async }}</h3>
      <div *ngIf="dice">
        <img #imgEl [src]="img$ | async" />
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
  public card$: BehaviorSubject<{ title: string; text: string }>;

  @ViewChild('imgEl') imgEl: ElementRef;

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
        const imageEl = this.imgEl?.nativeElement as HTMLImageElement;

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
