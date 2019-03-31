import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSelectComponent } from './single-select.component';
import { PanelModule } from '../../../overlay/panel/panel.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { SingleListModule } from '../single-list/single-list.module';
import { InputModule } from '../../input/input.module';
import { MatTooltipModule } from '@angular/material';
import { IconsModule } from '../../../icons/icons.module';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';

@NgModule({
  declarations: [
    SingleSelectComponent,
  ],
  imports: [
    CommonModule,
    PanelModule,
    ButtonsModule,
    OverlayModule,
    SingleListModule,
    InputModule,
    MatTooltipModule,
    IconsModule
  ],
  exports: [
    SingleSelectComponent,
  ],
  providers: [
    ListChangeService,
    ListModelService,
  ]
})
export class SingleSelectModule {}
