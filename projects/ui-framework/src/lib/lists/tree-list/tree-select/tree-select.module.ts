import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeSelectComponent } from './tree-select.component';
import { TreeListPanelModule } from '../tree-list-panel/tree-list-panel.module';
import { InputMessageModule } from '../../../form-elements/input-message/input-message.module';
import { FormElementLabelModule } from '../../../form-elements/form-element-label/form-element-label.module';
import { TruncateTooltipModule } from '../../../popups/truncate-tooltip/truncate-tooltip.module';

@NgModule({
  declarations: [TreeSelectComponent],
  imports: [
    CommonModule,
    TreeListPanelModule,
    InputMessageModule,
    FormElementLabelModule,
    TruncateTooltipModule,
  ],
  exports: [TreeSelectComponent],
})
export class TreeSelectModule {}
