import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicListComponent } from './basic-list.component';
import { IconsModule } from '../../icons/icons.module';
import { BasicListActionDirective } from './basic-list-action.directive';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [BasicListComponent, BasicListActionDirective],
  imports: [CommonModule, IconsModule],
  exports: [BasicListComponent, BasicListActionDirective],
  providers: [EventManagerPlugins[0]],
})
export class BasicListModule {}
