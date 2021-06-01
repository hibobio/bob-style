import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetBoxComponent } from './widget-box.component';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { IconsModule } from '../../icons/icons.module';
import { ListLayoutComponent } from './list-layout/list-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackByPropModule } from '../../services/filters/trackByProp.pipe';
import { HorizontalLayoutComponent } from './horizontal-layout/horizontal-layout.component';
import { CardsModule } from '../../cards/cards.module';

@NgModule({
  declarations: [
    WidgetBoxComponent,
    ListLayoutComponent,
    HorizontalLayoutComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ButtonsModule,
    TypographyModule,
    IconsModule,
    TrackByPropModule,
    CardsModule
  ],
  exports: [WidgetBoxComponent, ListLayoutComponent, HorizontalLayoutComponent],
  providers: [],
})
export class WidgetBoxModule {}
