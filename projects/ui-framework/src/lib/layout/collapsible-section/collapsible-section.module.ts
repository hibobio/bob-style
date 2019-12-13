import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TypographyModule } from '../../typography/typography.module';
import { CollapsibleSectionComponent } from './collapsible-section.component';
import { UtilsModule } from '../../services/utils/utils.module';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { ColorService } from '../../services/color-service/color.service';

@NgModule({
  declarations: [CollapsibleSectionComponent],
  imports: [CommonModule, TypographyModule, MatExpansionModule, UtilsModule],
  exports: [CollapsibleSectionComponent],
  providers: [DOMhelpers, ColorService, EventManagerPlugins[0]],
})
export class CollapsibleSectionModule {}
