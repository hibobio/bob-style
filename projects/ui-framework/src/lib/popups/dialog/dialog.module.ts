import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from './dialog-service/dialog.service';
import { DialogComponent } from './dialog.component';
import { TypographyModule } from '../../typography/typography.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { MiniPreloaderModule } from '../../indicators/mini-preloader/mini-preloader.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [DialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    TypographyModule,
    ButtonsModule,
    IconsModule,
    MiniPreloaderModule,
    ScrollingModule,
  ],
  exports: [DialogComponent],
  providers: [DialogService],
  entryComponents: [DialogComponent],
})
export class DialogModule {}
