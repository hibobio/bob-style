import { NgModule } from '@angular/core';
import { TextareaComponent } from './textarea.component';
import { MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    TextareaComponent,
  ],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    CommonModule,
  ],
  exports: [
    TextareaComponent,
  ],
})
export class TextareaModule {
}
