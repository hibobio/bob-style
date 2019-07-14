import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../ui-framework/src/lib/services/utils/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private utilsService: UtilsService) {}

  editorValue = 'some text';
  scrollSubscription;

  updateValue(event) {
    console.log(event);
    this.editorValue = event;
  }

  ngOnInit(): void {
    this.scrollSubscription = this.utilsService
      .getScrollEvent()
      .subscribe(scrollPos => {
        console.log(scrollPos);
      });
  }
}
