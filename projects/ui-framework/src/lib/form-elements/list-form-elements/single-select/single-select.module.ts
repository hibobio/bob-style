import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSelectComponent } from './single-select.component';
import { PanelModule } from '../../../overlay/panel/panel.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { OverlayModule } from '@angular/cdk/overlay';
import { SingleListModule } from '../single-list/single-list.module';
import { SearchModule } from '../../../navigation/search';
import { InputModule } from '../../input';

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
    SearchModule,
    InputModule,
  ],
  exports: [
    SingleSelectComponent,
  ],
  providers: [
  ],
})
export class SingleSelectModule {
}
