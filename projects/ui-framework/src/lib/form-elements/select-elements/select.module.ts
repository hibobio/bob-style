import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SearchModule } from '../../shem-zmani/search/search.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { SelectModelService } from './select/select-model.service';
import { SingleSelectComponent } from './single-select/single-select.component';
import { SelectComponent } from './select/select.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';

@NgModule({
  declarations: [
    SelectComponent,
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
    ButtonsModule,
    FlexLayoutModule,
  ],
  providers: [
    SelectModelService,
  ],
  exports: [
    // SelectComponent,
    SingleSelectComponent,
    MultiSelectComponent,
  ],
})
export class SelectModule {
}
