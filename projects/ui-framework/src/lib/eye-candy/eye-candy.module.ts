import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingAvatarsComponent } from './floating-avatars/floating-avatars.component';
import { UtilsModule } from '../services/utils/utils.module';

@NgModule({
  declarations: [
    FloatingAvatarsComponent,
  ],
  imports: [
    CommonModule,
    UtilsModule,
  ],
  exports: [
    FloatingAvatarsComponent,
  ]
})
export class EyeCandyModule {
}
