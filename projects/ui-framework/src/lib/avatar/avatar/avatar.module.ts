import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar.component';
import { IconsModule } from '../../icons/icons.module';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { ChipModule } from '../../chips/chip/chip.module';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { AvatarImageComponent } from './avatar-image/avatar-image.component';

@NgModule({
  declarations: [AvatarComponent, AvatarImageComponent],
  imports: [CommonModule, IconsModule, TruncateTooltipModule, ChipModule],
  exports: [AvatarComponent, AvatarImageComponent],
  entryComponents: [AvatarComponent, AvatarImageComponent],
  providers: [DOMhelpers, EventManagerPlugins[0]],
})
export class AvatarModule {}
