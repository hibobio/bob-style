import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetBoxComponent } from './widget-box.component';
import { ListLayoutItemDirective } from './list-layout-item.directive';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { IconsModule } from '../../icons/icons.module';
import { ListLayoutComponent } from './list-layout/list-layout.component';

@NgModule({
  declarations: [WidgetBoxComponent, ListLayoutItemDirective, ListLayoutComponent],
  imports: [CommonModule, ButtonsModule, TypographyModule, IconsModule],
  exports: [WidgetBoxComponent, ListLayoutItemDirective, ListLayoutComponent],
  providers: [],
})
export class WidgetBoxModule {}
