import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { IconsModule } from '../../icons/icons.module';
import { TypographyModule } from '../../typography/typography.module';
import { UtilsService } from '../../utils/utils.service';
import { UtilsModule } from '../../utils/utils.module';

@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [CommonModule, IconsModule, TypographyModule, UtilsModule],
  exports: [BreadcrumbsComponent],
  providers: [UtilsService]
})
export class BreadcrumbsModule {}
