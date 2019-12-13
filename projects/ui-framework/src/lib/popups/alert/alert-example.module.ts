import { Component, NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './alert-service/alert.service';
import { AlertConfig } from './alert.interface';
import { AlertType } from './alert.enum';
import { ButtonsModule } from '../../buttons/buttons.module';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

@Component({
  selector: 'b-alert-example',
  template: `
    <b-button (clicked)="showAlert()">Show alert</b-button>
  `,
  providers: []
})
export class AlertExampleComponent {
  @Input() public alertType: AlertType;
  @Input() public text: string;
  @Input() public title: string;

  constructor(private alertService: AlertService) {}

  showAlert(): void {
    const alertConfig: AlertConfig = {
      alertType: this.alertType,
      title: this.title,
      text: this.text
    };
    this.alertService.showAlert(alertConfig);
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
  providers: [AlertService]
})
export class AlertExampleModule {}
