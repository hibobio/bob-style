import { NgModule } from '@angular/core';
import { TextareaComponent } from './textarea.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TextareaComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
  ],
  exports: [
    TextareaComponent,
  ],
  providers: [TextareaComponent],
})
export class TextareaModule {
}
