import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { DialogModule } from '../dialog/dialog.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { InputModule } from '../../form-elements/input/input.module';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ConfirmationDialogComponent, DeleteConfirmationDialogComponent],
  imports: [CommonModule, DialogModule, ButtonsModule, TypographyModule, InputModule, TranslateModule],
  entryComponents: [ConfirmationDialogComponent],
})
export class ConfirmationDialogModule {}
