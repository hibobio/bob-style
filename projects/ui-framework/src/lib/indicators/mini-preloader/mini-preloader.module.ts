import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniPreloaderComponent } from './mini-preloader.component';

@NgModule({
  declarations: [
    MiniPreloaderComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MiniPreloaderComponent,
  ],
  providers: [],
})
export class MiniPreloaderModule {
}
