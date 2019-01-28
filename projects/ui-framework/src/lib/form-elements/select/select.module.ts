import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SearchModule } from '../../navigation/search/search.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { SelectModelService } from './select-model-service/select-model.service';
import { SingleSelectComponent } from './single-select/single-select.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { IconsModule } from '../../icons';

@NgModule({
  declarations: [
    SingleSelectComponent,
    MultiSelectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    SearchModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTooltipModule,
    ButtonsModule,
    FlexLayoutModule,
    IconsModule,
  ],
  providers: [
    SelectModelService,
  ],
  exports: [
    SingleSelectComponent,
    MultiSelectComponent,
  ],
})
export class SelectModule {
}
