import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { interval } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  mockBadJobs,
  mockNames,
} from '../../../../ui-framework/src/lib/mock.const';
import {
  makeArray,
  randomFromArray,
  simpleUID,
} from '../../../../ui-framework/src/lib/services/utils/functional-utils';
import { TrackByPropModule } from '../../../../ui-framework/src/lib/services/filters/trackByProp.pipe';
import { NgLetModule } from '../../../../ui-framework/src/lib/services/utils/nglet.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pipes-decorators',
  template: `
    <ng-container
      *ngLet="{ items: items$ | async, date: date$ | async } as data"
    >
      <h4 class="pad-16 mrg-y-24">Now: {{ data.date }}</h4>

      <div
        class="pad-16 brd-b"
        *ngFor="
          let item of data.items;
          let index = index;
          trackBy: ['id', 'name'] | trackByProp
        "
      >
        {{ prefix[index] }} <strong>{{ item.name }}</strong> is a
        <u>{{ item.job }}</u>
      </div>
    </ng-container>

    <div class="pad-16 mrg-y-24">
      <button (click)="enabled ? stopIt() : startIt()">
        {{ enabled ? 'stop it' : 'start it' }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipesDecoratorsComponent {
  constructor() {}

  num = 3;
  ids = makeArray(this.num).map(() => simpleUID());
  names = makeArray(this.num).map(() => mockNames(1));
  prefix = randomFromArray(
    [
      'My friend',
      'My neighbour',
      "My wife's brother",
      'My ex-husband',
      'One guy I know',
    ],
    null
  );
  enabled = true;

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

@NgModule({
  declarations: [PipesDecoratorsComponent],
  exports: [PipesDecoratorsComponent],
  imports: [CommonModule, TrackByPropModule, NgLetModule],
  providers: [],
})
export class PipesDecoratorsModule {}
