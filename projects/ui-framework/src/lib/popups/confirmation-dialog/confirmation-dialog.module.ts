import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';
import { DialogService } from '../dialog/dialog-service/dialog.service';
import { DialogModule } from '../dialog/dialog.module';
import { MatDialogModule } from '@angular/material';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    ButtonsModule,
    TypographyModule,
  ],
  entryComponents: [
    ConfirmationDialogComponent,
  ],
})
export class ConfirmationDialogModule {
}
