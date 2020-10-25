import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicListComponent } from './basic-list.component';
import { IconsModule } from '../../icons/icons.module';
import { BasicListActionDirective } from './basic-list-action.directive';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { EmptyStateModule } from '../../indicators/empty-state/empty-state.module';

@NgModule({
  declarations: [BasicListComponent, BasicListActionDirective],
  imports: [CommonModule, IconsModule, EmptyStateModule],
  exports: [BasicListComponent, BasicListActionDirective],
  providers: [EventManagerPlugins[0]],
})
export class BasicListModule {}
