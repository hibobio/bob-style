import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesShowcaseComponent } from './employees-showcase.component';
import { AvatarModule } from '../avatar/avatar.module';
import { IconsModule } from '../../icons/icons.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { SingleSelectPanelModule } from '../../lists/single-select-panel/single-select-panel.module';
import { EmployeesShowcaseService } from './employees-showcase.service';

@NgModule({
  declarations: [EmployeesShowcaseComponent],
  imports: [CommonModule, AvatarModule, IconsModule, SingleSelectPanelModule],
  exports: [EmployeesShowcaseComponent],
  entryComponents: [],
  providers: [EmployeesShowcaseService, EventManagerPlugins[0]],
})
export class EmployeesShowcaseModule {}
