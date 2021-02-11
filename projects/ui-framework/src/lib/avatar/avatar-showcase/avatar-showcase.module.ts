import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesShowcaseComponent } from './avatar-showcase.component';
import { AvatarModule } from '../avatar/avatar.module';
import { IconsModule } from '../../icons/icons.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { SingleSelectPanelModule } from '../../lists/single-select-panel/single-select-panel.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgLetModule } from '../../services/utils/nglet.directive';

@NgModule({
  declarations: [EmployeesShowcaseComponent],
  imports: [
    CommonModule,
    AvatarModule,
    IconsModule,
    SingleSelectPanelModule,
    TranslateModule,
    NgLetModule,
  ],
  exports: [EmployeesShowcaseComponent],
  entryComponents: [],
  providers: [EventManagerPlugins[0]],
})
export class EmployeesShowcaseModule {}
