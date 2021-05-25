import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetBoxComponent } from './widget-box.component';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { IconsModule } from '../../icons/icons.module';
import { ListLayoutComponent } from './list-layout/list-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { DividerModule } from '../divider/divider.module';

@NgModule({
  declarations: [
    WidgetBoxComponent,
    ListLayoutComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ButtonsModule,
    TypographyModule,
    IconsModule,
    DividerModule
  ],
  exports: [WidgetBoxComponent, ListLayoutComponent],
  providers: [],
})
export class WidgetBoxModule {}
