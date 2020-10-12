import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import { PanelModule } from '../../popups/panel/panel.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MultiListModule } from '../multi-list/multi-list.module';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { FormElementLabelModule } from '../../form-elements/form-element-label/form-element-label.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MultiSelectComponent],
  imports: [
    CommonModule,
    PanelModule,
    ButtonsModule,
    OverlayModule,
    MultiListModule,
    TruncateTooltipModule,
    InputMessageModule,
    FormElementLabelModule,
    TranslateModule,
  ],
  exports: [MultiSelectComponent],
  providers: [ListChangeService, ListModelService, DOMhelpers],
})
export class MultiSelectModule {}
