import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { interval, Observable, of, Subscription, throwError } from 'rxjs';
import { delay, filter, map, switchMap, catchError } from 'rxjs/operators';
import {
  objectGetDeepestValid,
  randomNumber,
  stringify,
} from '../../../../ui-framework/src/lib/services/utils/functional-utils';
import { ɵɵdirectiveInject as directiveInject } from '@angular/core';
import { AlertService } from '../../../../ui-framework/src/lib/popups/alert/alert-service/alert.service';
import { AlertType } from '../../../../ui-framework/src/lib/popups/alert/alert.enum';
import { AlertModule } from '../../../../ui-framework/src/lib/popups/alert/alert.module';

export function catchAndAlertError<T = any>({
  title = null,
  text = null,
  reThrow = true,
}: {
  title?: string;
  text?: string;
  reThrow?: boolean;
} = {}) {
  const alertService = directiveInject(AlertService);
  // const translate = directiveInject(TranslateService);

  return function (source: Observable<T>): Observable<T> {
    return source.pipe(
      catchError((err: any) => {
        alertService.showAlert({
          alertType: AlertType.error,
          title: title,
          text: text || stringify(objectGetDeepestValid(err, 'error.error')),
        });
        return reThrow ? throwError(err) : of(null);
      })
    );
  };
}

const mapoperator = (source: Observable<any>): Observable<any> => {
  return new Observable<any>((subscriber) => {
    return source.subscribe({
      //
      next: (value) => {
        subscriber.next(value * 10);
      },

      complete() {
        subscriber.complete();
      },

      error(error) {
        subscriber.error(error);
      },
    });
  });
};

@Component({
  selector: 'custom-operators',
  template: `
    <div
      class="pad-40 mrg-40 brd rounded b-display-2 text-center flx flx-center"
    >
      {{ (thing1$ | async) + '' }}
    </div>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AlertService],
})
export class CustomOperatorsComponent {
  constructor() {}

  thing1$ = interval(1500).pipe(
    //
    map((v) => (randomNumber() > 50 ? v : null)),

    switchMap(() => throwError({ error: '1' })),

    catchAndAlertError()
    //
  );
}

@NgModule({
  declarations: [CustomOperatorsComponent],
  imports: [BrowserModule, CommonModule, AlertModule, TranslateModule],
  exports: [CustomOperatorsComponent],
  providers: [TranslateService, AlertService],
  entryComponents: [],
})
export class DateParseTesterModule {}
