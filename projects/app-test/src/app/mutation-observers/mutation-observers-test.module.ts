import {
  NgModule,
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MutationObservableService } from '../../../../ui-framework/src/lib/services/utils/mutation-observable';
import { FormsModule } from '@angular/forms';
import { arrayOfNumbers } from '../../../../ui-framework/src/lib/services/utils/functional-utils';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mutation-observers-test',
  templateUrl: './mutation-observers-test.component.html',
  styleUrls: ['./mutation-observers-test.component.scss'],
})
export class MutationObserversTestComponent implements OnInit {
  constructor(
    private host: ElementRef,
    private cd: ChangeDetectorRef,
    private mutationObservableService: MutationObservableService
  ) {
    this.hostEl = this.host.nativeElement;
  }

  @ViewChild('moBox', { static: true }) moBox: ElementRef;
  @ViewChild('moTextArea', { static: true }) moTextArea: ElementRef;

  public hostEl: HTMLElement;

  public textInputValue = 'hello';
  public numbers = arrayOfNumbers(5);

  public moMessage$: Observable<string>;
  public ioMessage$: Observable<boolean>;
  public roMessage$: Observable<string>;

  public addNumber() {
    this.numbers.push(this.numbers.length);
  }

  ngOnInit() {
    this.moMessage$ = this.mutationObservableService
      .getMutationObservable(this.moBox.nativeElement)
      .pipe(
        map((els) => {
          return Array.from(els)
            .map((el) => el?.getAttribute('id') || el?.getAttribute('class'))
            .join(', ');
        })
      );

    this.ioMessage$ = this.mutationObservableService
      .getIntersectionObservable(this.moBox.nativeElement)
      .pipe(map((entry) => entry.isIntersecting));

    this.roMessage$ = this.mutationObservableService
      .getResizeObservervable(this.moTextArea.nativeElement)
      .pipe(
        map((rect) => `${rect.width} x ${rect.height}`),
        tap(() => {
          this.cd.detectChanges();
        })
      );

    this.cd.detectChanges();
  }
}

@NgModule({
  declarations: [MutationObserversTestComponent],
  exports: [MutationObserversTestComponent],
  imports: [CommonModule, FormsModule],
  providers: [],
  entryComponents: [],
})
export class MutationObserversTestModule {}
