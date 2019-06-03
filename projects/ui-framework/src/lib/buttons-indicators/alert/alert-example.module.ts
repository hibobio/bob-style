import {Component, NgModule, Input, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertService} from './alert-service/alert.service';
import {AlertConfig} from './alert.interface';
import {AlertType} from './alert.enum';
import {ButtonsModule} from '../buttons/buttons.module';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

@Component({
  selector: 'b-alert-example',
  template: `<b-button (click)="showAlert()">Show alert</b-button>`
})
export class AlertExampleComponent implements OnDestroy {
  @Input() public alertType: AlertType;
  @Input() public text: string;
  @Input() public title: string;

  constructor(private alertService: AlertService) {
  }

  showAlert(): void {
    const alertConfig: AlertConfig = {
      alertType: this.alertType,
      title: this.title,
      text: this.text
    };
    this.alertService.showAlert(alertConfig);
  }

  ngOnDestroy(): void {
    this.alertService.closeAlert();
  }
}

@NgModule({
  declarations: [AlertExampleComponent],
  imports: [
    CommonModule,
    ButtonsModule,
    NoopAnimationsModule,
    BrowserAnimationsModule
  ],
  exports: [AlertExampleComponent],
  providers: [AlertService],
})
export class AlertExampleModule { }
