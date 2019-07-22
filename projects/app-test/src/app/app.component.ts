import { Subscription } from 'rxjs';
import { UtilsService } from '../../../ui-framework/src/lib/services/utils/utils.service';
import { outsideZone } from '../../../ui-framework/src/lib/services/utils/rxjs.operators';

import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectionStrategy
} from '@angular/core';
import { MobileService } from '../../../ui-framework/src/lib/services/utils/mobile.service';
import { makeArray } from '../../../ui-framework/src/lib/services/utils/functional-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private utilsService: UtilsService,
    private zone: NgZone,
    private mobileService: MobileService
  ) {}

  editorsNumber = 200;
  editorValues = makeArray(this.editorsNumber).map(i => 'some text');
  scrollSubscription: Subscription;
  resizeSubscription: Subscription;
  mediaSubscribtion: Subscription;

  updateValue(event, index) {
    console.log(event);
    this.editorValues[index] = event;
  }

  editorTrackBy(index) {
    return index;
  }

  ngOnInit(): void {
    this.scrollSubscription = this.utilsService
      .getScrollEvent()
      .pipe(outsideZone(this.zone))
      .subscribe(scrollPos => {
        console.log(scrollPos);
      });
    this.resizeSubscription = this.utilsService
      .getResizeEvent()
      .pipe(outsideZone(this.zone))
      .subscribe(event => {
        console.log('window resized', event);
      });

    this.mediaSubscribtion = this.mobileService
      .getMediaEvent()
      .subscribe(value => {
        console.log(value);
      });
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
    this.resizeSubscription.unsubscribe();
    this.mediaSubscribtion.unsubscribe();
  }
}
