import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadMoreComponent } from './read-more.component';
import { ButtonsModule } from '../../buttons/buttons.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  imports: [CommonModule, ButtonsModule],
  declarations: [ReadMoreComponent],
  exports: [ReadMoreComponent],
  providers: [EventManagerPlugins[0]],
})
export class ReadMoreModule {}
