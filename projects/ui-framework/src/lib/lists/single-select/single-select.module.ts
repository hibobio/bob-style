import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSelectComponent } from './single-select.component';
import { PanelModule } from '../../popups/panel/panel.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { SingleListModule } from '../single-list/single-list.module';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';
import { ListFooterModule } from '../list-footer/list-footer.module';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { FormElementLabelModule } from '../../form-elements/form-element-label/form-element-label.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SingleSelectComponent],
  imports: [
    CommonModule,
    PanelModule,
    ButtonsModule,
    OverlayModule,
    SingleListModule,
    TruncateTooltipModule,
    InputMessageModule,
    ListFooterModule,
    FormElementLabelModule,
    TranslateModule,
  ],
  exports: [SingleSelectComponent],
  providers: [ListChangeService, ListModelService],
})
export class SingleSelectModule {}
