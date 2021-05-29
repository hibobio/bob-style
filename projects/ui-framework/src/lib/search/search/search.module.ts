import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InputModule } from '../../form-elements/input/input.module';
import { IconsModule } from '../../icons/icons.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { SearchComponent } from './search.component';
import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [SearchComponent, SearchPipe],
  imports: [CommonModule, IconsModule, InputModule],
  exports: [SearchComponent, SearchPipe],
  providers: [EventManagerPlugins[0]],
})
export class SearchModule {}
