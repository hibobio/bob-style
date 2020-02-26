import { Injectable } from '@angular/core';
import { DialogSize } from '../dialog/dialog.enum';
import { DialogService } from '../dialog/dialog-service/dialog.service';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogConfig } from './confirmation-dialog.interface';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(private dialogService: DialogService) {}

  openDialog(config: ConfirmationDialogConfig): MatDialogRef<any> {
    return this.dialogService.openDialog(ConfirmationDialogComponent, {
      size: DialogSize.small,
      panelClass: config.class,
      data: config,
    });
  }
}
