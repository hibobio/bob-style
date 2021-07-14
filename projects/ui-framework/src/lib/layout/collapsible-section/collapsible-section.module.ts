import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { IconsModule } from '../../icons/icons.module';
import { TypographyModule } from '../../typography/typography.module';
import { CollapsibleSectionComponent } from './collapsible-section.component';
import { UtilsModule } from '../../services/utils/utils.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [CollapsibleSectionComponent],
  imports: [CommonModule, TypographyModule, MatExpansionModule, UtilsModule, IconsModule],
  exports: [CollapsibleSectionComponent],
  providers: [EventManagerPlugins[0]],
})
export class CollapsibleSectionModule {}
