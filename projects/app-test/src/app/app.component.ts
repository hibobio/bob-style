import { of, Subject } from 'rxjs';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  debug,
  slicer,
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

  items$ = of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).pipe(
    slicer(3, this.next$, this.prev$, {
      loop: true,
    }),
    debug('items$')
  );
}
