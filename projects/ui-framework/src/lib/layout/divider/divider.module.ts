import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerComponent } from './divider.component';

@NgModule({
  declarations: [
    DividerComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DividerComponent,
  ],
  providers: [],
})
export class DividerModule {
}
