import {Injector, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { IconsModule } from '../../icons/icons.module';
import { AlertService} from './alert-service/alert.service';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';

@NgModule({
  declarations: [AlertComponent],
  entryComponents: [AlertComponent],
  imports: [CommonModule, IconsModule, ButtonsModule, TypographyModule],
  exports: [AlertComponent],
  providers: [
    AlertService,
  ]
})
export class AlertModule {}
