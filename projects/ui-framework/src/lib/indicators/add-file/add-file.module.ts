import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFileComponent } from './add-file.component';
import {IconsModule} from '../../icons/icons.module';

@NgModule({
  declarations: [AddFileComponent],
  imports: [CommonModule, IconsModule],
  exports: [AddFileComponent],
})
export class AddFileModule {
}
