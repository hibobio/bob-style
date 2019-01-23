import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';
import { DialogService } from './dialog.service';
import { DialogComponent } from './dialog.component';
import { TypographyModule } from '../../typography/typography.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [
    DialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    TypographyModule,
    ButtonsModule,
    IconsModule,
  ],
  exports: [
    DialogComponent,
  ],
  providers: [
    DialogService,
  ],
  entryComponents: [
    DialogComponent,
  ],
})
export class DialogModule {
}
