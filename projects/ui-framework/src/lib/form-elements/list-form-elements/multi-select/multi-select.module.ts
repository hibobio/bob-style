import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import { PanelModule } from '../../../overlay/panel/panel.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { OverlayModule } from '@angular/cdk/overlay';
import { SearchModule } from '../../../navigation/search';
import { InputModule } from '../../input';
import { MultiListModule } from '../multi-list/multi-list.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    MultiSelectComponent,
  ],
  imports: [
    CommonModule,
    PanelModule,
    ButtonsModule,
    OverlayModule,
    MultiListModule,
    SearchModule,
    InputModule,
    FlexLayoutModule,
  ],
  exports: [
    MultiSelectComponent,
  ],
  providers: [
  ],
})
export class MultiSelectModule {
}
