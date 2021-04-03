

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, NgModule } from '@angular/core';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import { ButtonsModule } from '../../buttons/buttons.module';
import { AlertService } from './alert-service/alert.service';
import { AlertType } from './alert.enum';
import { AlertConfig } from './alert.interface';

@Component({
  selector: 'b-alert-example',
  template: `
    <b-button class="mrg-4" (clicked)="showAlert()">Show Alert</b-button>
    <b-button class="mrg-4" [type]="'positive'" (clicked)="showSuccessAlert()"
      >Show Success</b-button
    >
    <b-button class="mrg-4" [type]="'negative'" (clicked)="showErrorAlert()"
      >Show Error</b-button
    >
  `,
  providers: [],
})
export class AlertExampleComponent {
  constructor(private http: HttpClient, private alertService: AlertService) {}

  @Input() public alertType: AlertType;
  @Input() public text: string;
  @Input() public title: string;

  showSuccessAlert(): void {
    // this.http
    //   .get<any>(
    //     'https://vimeo.com/api/v2/video/531368853.json'
    //   )
    //   .pipe(
    //     catchError((error) => {
    //       console.log(error);
    //       return of(error);
    //     })
    //   )
    //   .subscribe((response) => {
    //     console.log(response);
    //     this.alertService.showSuccessAlert(response);
    //   });

    this.alertService.showSuccessAlert('Something good happened');
  }

  showErrorAlert(): void {
    // this.http
    //   .get<any>('https://vimeo.com/api/v2/video/BadDataReuest.json')
    //   .pipe(
    //     catchError((error) => {
    //       console.log(error);
    //       this.alertService.showErrorAlert(error);
    //       return of(error);
    //     })
    //   )
    //   .subscribe();

    this.alertService.showErrorAlert('Something bad happened');
  }

  showAlert(): void {
    const alertConfig: AlertConfig = {
      alertType: this.alertType,
      title: this.title,
      text: this.text,
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
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  exports: [AlertExampleComponent],
  providers: [AlertService],
})
export class AlertExampleModule {}
