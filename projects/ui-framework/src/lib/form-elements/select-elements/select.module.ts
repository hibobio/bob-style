import { NgModule } from '@angular/core';
import { SelectComponent } from './select/select.component';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchModule } from '../search/search.module';
import { ButtonsModule } from '../../buttons';
import { SelectModelService } from './select/select-model.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SingleSelectComponent } from './single-select/single-select.component';
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
  exports: [
    SingleSelectComponent,
    MultiSelectComponent,
  ],
  providers: [
    SelectModelService,
  ]
})
export class SelectModule {
}
