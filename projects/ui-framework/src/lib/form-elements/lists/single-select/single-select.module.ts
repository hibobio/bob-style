import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSelectComponent } from './single-select.component';
import { PanelModule } from '../../../popups/panel/panel.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { SingleListModule } from '../single-list/single-list.module';
import { InputModule } from '../../input/input.module';
import { MatTooltipModule } from '@angular/material';
import { IconsModule } from '../../../icons/icons.module';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';
import { ListFooterModule } from '../list-footer/list-footer.module';
import { TruncateTooltipModule } from '../../../services/truncate-tooltip/truncate-tooltip.module';
import { InputMessageModule } from '../../input-message/input-message.module';

@NgModule({
  declarations: [SingleSelectComponent],
  imports: [
    CommonModule,
    PanelModule,

    ButtonsModule,
    OverlayModule,

    SingleListModule,

    // InputModule,

    TruncateTooltipModule,
    InputMessageModule,

    MatTooltipModule,

    IconsModule,
    ListFooterModule
  ],
  exports: [SingleSelectComponent],
  providers: [ListChangeService, ListModelService]
})
export class SingleSelectModule {}
