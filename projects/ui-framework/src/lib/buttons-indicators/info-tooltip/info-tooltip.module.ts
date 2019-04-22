import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoTooltipComponent } from './info-tooltip.component';
import {IconsModule} from '../../icons/icons.module';
import {PanelModule} from '../../overlay/panel/panel.module';
import { TypographyModule } from '../../typography/typography.module';
import {LinkModule} from '../link/link.module';

@NgModule({
  declarations: [InfoTooltipComponent],
  imports: [
    CommonModule,
    IconsModule,
    PanelModule,
    TypographyModule,
    LinkModule
  ],
  exports: [InfoTooltipComponent],
})
export class InfoTooltipModule { }
