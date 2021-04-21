import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonsModule } from '../../buttons/buttons.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { BReadMoreComponent } from './b-read-more.component';

@NgModule({
  imports: [CommonModule, ButtonsModule],
  declarations: [BReadMoreComponent],
  exports: [BReadMoreComponent],
  providers: [EventManagerPlugins[0]],
})
export class BReadMoreModule {}
