import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import { PanelModule } from '../../popups/panel/panel.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MultiListModule } from '../multi-list/multi-list.module';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { FormElementLabelModule } from '../../form-elements/form-element-label/form-element-label.module';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeesShowcaseModule } from '../../avatar/employees-showcase/employees-showcase.module';

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
    EmployeesShowcaseModule,
  ],
  exports: [MultiSelectComponent],
  providers: [],
})
export class MultiSelectModule {}
