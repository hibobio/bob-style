import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonsModule } from '../../buttons/buttons.module';
import { InputModule } from '../../form-elements/input/input.module';
import { InfoStripModule } from '../../indicators/info-strip/info-strip.module';
import { TypographyModule } from '../../typography/typography.module';
import { DialogModule } from '../dialog/dialog.module';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    DeleteConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    ButtonsModule,
    TypographyModule,
    InputModule,
    TranslateModule,
    InfoStripModule,
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    DeleteConfirmationDialogComponent,
  ],
})
export class ConfirmationDialogModule {}
