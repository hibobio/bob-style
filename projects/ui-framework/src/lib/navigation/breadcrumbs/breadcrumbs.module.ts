import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { IconsModule } from '../../icons/icons.module';
import { TypographyModule } from '../../typography/typography.module';
import { UtilsService } from '../../services/utils/utils.service';
import { UtilsModule } from '../../services/utils/utils.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [
    CommonModule,
    IconsModule,
    TypographyModule,
    UtilsModule,
    ButtonsModule,
    MatTooltipModule,
    IconsModule,
  ],
  exports: [BreadcrumbsComponent],
  providers: [UtilsService]
})
export class BreadcrumbsModule {}
