import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ButtonsModule } from '../../buttons/buttons.module';
import { InfoStripIconSize } from '../../indicators/info-strip/info-strip.enum';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogConfig } from './confirmation-dialog.interface';
import { ConfirmationDialogModule } from './confirmation-dialog.module';
import { ConfirmationDialogService } from './confirmation-dialog.service';

@Component({
  selector: 'b-confirmation-dialog-example',
  template: `
    <b-button class="mrg-4" (clicked)="openDialog()" style="margin-right: 10px;"
      >Delete</b-button
    >

    <b-button class="mrg-4" (clicked)="openDialog2()"
      >Delete with warning</b-button
    >

    <b-button class="mrg-4" (clicked)="openDeleteConfirmationDialog()"
      >Confirm And Delete</b-button
    >
  `,
})
export class ConfirmationDialogExampleComponent {
  constructor(private cds: ConfirmationDialogService) {}

  openDialog(): void {
    const dialogConfig: ConfirmationDialogConfig = {
      title: 'Are you sure?',
      message:
        'Deleting the data cannot be undone, please make sure you have backed up sensitive data',
      buttonConfig: {
        ok: {
          label: 'ok',
          action: () => true,
        },
        cancel: {
          label: 'Cancel',
        },
      },
      class: 'confirmation-example-dialog',
    };

    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.cds.openDialog(
      dialogConfig
    );
  }

  openDialog2(): void {
    const dialogConfig: ConfirmationDialogConfig = {
      title: 'Are you sure?',
      message: 'Please think twice',

      infoStrip: {
        text:
          'Deleting the data cannot be undone, please make sure you have backed up sensitive data',
        iconSize: InfoStripIconSize.normal,
      },

      buttonConfig: {
        ok: {
          label: 'Noone tells me what to do',
          action: () => true,
        },
        cancel: {
          label: 'I doubt myself',
        },
      },
      class: 'confirmation-example-dialog',
    };

    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.cds.openDialog(
      dialogConfig
    );
  }

  openDeleteConfirmationDialog(): void {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.cds.openDeleteConfirmationDialog();
  }
}

@NgModule({
  declarations: [ConfirmationDialogExampleComponent],
  imports: [CommonModule, ButtonsModule, ConfirmationDialogModule],
  exports: [ConfirmationDialogExampleComponent],
})
export class ConfirmationDialogExampleModule {}
