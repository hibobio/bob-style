import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxComponent } from './lightbox.component';
import { IconsModule } from '../../icons/icons.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';

import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { URLutils } from '../../services/url/url-utils';
import { UtilsService } from '../../services/utils/utils.service';

@NgModule({
  declarations: [LightboxComponent],
  entryComponents: [LightboxComponent],
  imports: [CommonModule, IconsModule, ButtonsModule, ComponentRendererModule],
  exports: [],
  providers: [URLutils, UtilsService]
})
export class LightboxModule {}
