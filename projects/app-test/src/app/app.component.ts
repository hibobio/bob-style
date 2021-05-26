import { of, Subject } from 'rxjs';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { arrayOfNumbers } from '../../../ui-framework/src/lib/services/utils/functional-utils';
import {
  debug,
  timedSlice,
} from '../../../ui-framework/src/lib/services/utils/rxjs.operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  prev$ = new Subject();
  next$ = new Subject();

  items$ = of(arrayOfNumbers(13, 1)).pipe(
    // slicer(4, this.next$, this.prev$, {
    //   loop: true,
    //   shuffle: true,
    // }),
    timedSlice(7, 1000, {
      loop: true,
      shuffle: 'auto',
    }),
    debug('items$')
  );
}
