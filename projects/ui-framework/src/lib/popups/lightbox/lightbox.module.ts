import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxComponent } from './lightbox.component';
import { IconsModule } from '../../icons/icons.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { MediaEmbedComponent } from './media-embed/media-embed.component';
import { NgLetModule } from '../../services/utils/nglet.directive';

@NgModule({
  declarations: [LightboxComponent, MediaEmbedComponent],
  entryComponents: [LightboxComponent],
  imports: [
    CommonModule,
    IconsModule,
    ButtonsModule,
    ComponentRendererModule,
    NgLetModule,
  ],
  exports: [LightboxComponent, MediaEmbedComponent],
  providers: [EventManagerPlugins[0]],
})
export class LightboxModule {}
