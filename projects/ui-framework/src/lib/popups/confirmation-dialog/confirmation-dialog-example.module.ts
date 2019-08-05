import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogSize } from '../dialog/dialog.enum';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';
import { ConfirmationDialogModule } from './confirmation-dialog.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { ConfirmationDialogConfig } from './confirmation-dialog.interface';

@Component({
  selector: 'b-confirmation-dialog-example',
  template: `
    <b-button (click)="openDialog()" style="margin-right: 10px;">Delete</b-button>
  `
})
export class ConfirmationDialogExampleComponent {
  constructor(
    private confirmationDialogService: ConfirmationDialogService,
  ) {
  }

  openDialog(): void {
    const dialogConfig: ConfirmationDialogConfig = {
      title: 'Are you sure?',
      message: 'Deleting the data cannot be undone, please make sure you have back up to sensitive data',
      buttonConfig: {
        ok: {
          label: 'ok',
          action: () => true,
        },
        cancel: {
          label: 'Cancel',
        }
      },
      class: 'confirmation-example-dialog',
    };

    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.confirmationDialogService
      .openDialog(dialogConfig);
  }
}

@NgModule({
  declarations: [
    ConfirmationDialogExampleComponent,
  ],
  imports: [
    CommonModule,
    ButtonsModule,
    ConfirmationDialogModule,
  ],
  exports: [
    ConfirmationDialogExampleComponent,
  ],
})
export class ConfirmationDialogExampleModule {
}
