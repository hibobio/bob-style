import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { IconsModule } from '../../icons';
import { TypographyModule } from '../../typography/typography.module';
import { UtilsModule } from '../../utils/utils.module';

@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [CommonModule, IconsModule, TypographyModule, UtilsModule],
  exports: [BreadcrumbsComponent],
  providers: []
})
export class BreadcrumbsModule {}
