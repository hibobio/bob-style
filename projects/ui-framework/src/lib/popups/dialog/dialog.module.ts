import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from './dialog-service/dialog.service';
import { DialogComponent } from './dialog.component';
import { TypographyModule } from '../../typography/typography.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { MiniPreloaderModule } from '../../buttons-indicators/mini-preloader/mini-preloader.module';

@NgModule({
  declarations: [DialogComponent],
  imports: [CommonModule, MatDialogModule, TypographyModule, ButtonsModule, IconsModule, MiniPreloaderModule],
  exports: [DialogComponent],
  entryComponents: [DialogComponent]
})
export class DialogModule {}
