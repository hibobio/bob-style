import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { DialogModule } from '../dialog/dialog.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [CommonModule, DialogModule, ButtonsModule, TypographyModule],
  entryComponents: [ConfirmationDialogComponent],
})
export class ConfirmationDialogModule {}
