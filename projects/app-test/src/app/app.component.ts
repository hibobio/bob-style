import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interval, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  mockBadJobs,
  mockNames,
} from '../../../ui-framework/src/lib/mock.const';
import {
  makeArray,
  simpleUID,
} from '../../../ui-framework/src/lib/services/utils/functional-utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      tester: ['', Validators.required]
    });
  }

  num = 3;
  ids = makeArray(this.num).map(() => simpleUID());
  names = makeArray(this.num).map(() => mockNames(1));
  enabled = true;

  inputEventHandler(val) {
    console.log('val: ', val);
  }

  stopIt() {
    this.enabled = false;
  }
  startIt() {
    this.enabled = true;
  }

  items$ = interval(1000).pipe(
    filter(() => this.enabled),
    map(() =>
      makeArray(this.num).map((_, index) => ({
        id: this.ids[index],
        name: this.names[index],
        job: mockBadJobs(1),
      }))
    )
  );

  date$ = interval(1000).pipe(
    filter(() => this.enabled),
    map(() => {
      const date = new Date();
      return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    })
  );
}
