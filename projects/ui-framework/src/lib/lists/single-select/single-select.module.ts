import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSelectComponent } from './single-select.component';
import { PanelModule } from '../../popups/panel/panel.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { SingleListModule } from '../single-list/single-list.module';
import { ListFooterModule } from '../list-footer/list-footer.module';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { FormElementLabelModule } from '../../form-elements/form-element-label/form-element-label.module';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { IconsModule } from '../../icons/icons.module';

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
    AvatarModule,
    IconsModule,
  ],
  exports: [SingleSelectComponent],
  providers: [],
})
export class SingleSelectModule {}
