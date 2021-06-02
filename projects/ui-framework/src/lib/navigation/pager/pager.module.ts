import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonsModule } from '../../buttons/buttons.module';
import { SingleSelectModule } from '../../lists/single-select/single-select.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { PagerComponent } from './pager.component';
import { PagerPipe } from './pager.pipe';

@NgModule({
  imports: [CommonModule, ButtonsModule, SingleSelectModule, TranslateModule],
  declarations: [PagerComponent, PagerPipe],
  exports: [PagerComponent, PagerPipe],
  providers: [EventManagerPlugins[0]],
})
export class PagerModule {}
