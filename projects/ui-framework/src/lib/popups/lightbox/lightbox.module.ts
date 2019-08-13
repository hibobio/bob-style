import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxComponent } from './lightbox.component';
import { IconsModule } from '../../icons/icons.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';

import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { URLutils } from '../../services/url/url-utils.service';
import { UtilsService } from '../../services/utils/utils.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { LightboxService } from './lightbox.service';
import { MediaEmbedComponent } from './media-embed/media-embed.component';

@NgModule({
  declarations: [LightboxComponent, MediaEmbedComponent],
  entryComponents: [LightboxComponent],
  imports: [CommonModule, IconsModule, ButtonsModule, ComponentRendererModule],
  exports: [LightboxComponent, MediaEmbedComponent],
  providers: [URLutils, UtilsService, LightboxService, EventManagerPlugins[0]]
})
export class LightboxModule {}
