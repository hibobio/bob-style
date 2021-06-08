import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonsModule } from '../../buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { TrackByPropModule } from '../../services/filters/trackByProp.pipe';
import { TypographyModule } from '../../typography/typography.module';
import { ReadMoreModule } from '../read-more/read-more.module';
import { InsightsPanelComponent } from './insights-panel.component';

@NgModule({
  imports: [
    CommonModule, IconsModule, ReadMoreModule, ButtonsModule, TypographyModule, TrackByPropModule, TranslateModule,
  ],
  declarations: [InsightsPanelComponent],
  exports: [InsightsPanelComponent],
})
export class InsightsPanelModule {}
