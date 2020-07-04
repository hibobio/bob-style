import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagerComponent } from './pager.component';
import { ButtonsModule } from '../../buttons/buttons.module';
import { SingleSelectModule } from '../../lists/single-select/single-select.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { PagerService } from './pager.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, ButtonsModule, SingleSelectModule, TranslateModule],
  declarations: [PagerComponent],
  exports: [PagerComponent],
  providers: [EventManagerPlugins[0], PagerService],
})
export class PagerModule {}
