import { Subscription } from 'rxjs';
import { UtilsService } from '../../../ui-framework/src/lib/services/utils/utils.service';
import { outsideZone } from '../../../ui-framework/src/lib/services/utils/rxjs.operators';

import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MobileService } from '../../../ui-framework/src/lib/services/utils/mobile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private utilsService: UtilsService,
    private zone: NgZone,
    private mobileService: MobileService
  ) {}

  editorValue = 'some text';
  scrollSubscription: Subscription;
  resizeSubscription: Subscription;
  mediaSubscribtion: Subscription;

  updateValue(event) {
    console.log(event);
    this.editorValue = event;
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
  }
}
