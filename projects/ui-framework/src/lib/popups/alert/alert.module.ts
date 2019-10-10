import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { IconsModule } from '../../icons/icons.module';
import { AlertService } from './alert-service/alert.service';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [AlertComponent],
  entryComponents: [AlertComponent],
  imports: [CommonModule, IconsModule, ButtonsModule, TypographyModule, OverlayModule],
  exports: [AlertComponent],
  providers: [AlertService]
})
export class AlertModule {}
