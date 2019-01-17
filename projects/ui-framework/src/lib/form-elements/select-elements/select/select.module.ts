import { NgModule } from '@angular/core';
import { SelectComponent } from './select.component';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchModule } from '../../search/search.module';
import { ButtonsModule } from '../../../buttons';
import { SelectModelService } from './select-model.service';

@NgModule({
  declarations: [
    SelectComponent,
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
  ],
  exports: [
    SelectComponent,
  ],
  providers: [
    SelectModelService,
  ]
})
export class SelectModule {
}
