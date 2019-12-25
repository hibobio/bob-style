import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingAvatarsComponent } from './floating-avatars/floating-avatars.component';
import { UtilsModule } from '../services/utils/utils.module';
import { ConfettiComponent } from './confetti/confetti.component';
import { SnowComponent } from './snow/snow.component';

@NgModule({
  declarations: [
    FloatingAvatarsComponent,
    ConfettiComponent,
    SnowComponent,
  ],
  imports: [
    CommonModule,
    UtilsModule,
  ],
  exports: [
    FloatingAvatarsComponent,
    ConfettiComponent,
    SnowComponent,
  ]
})
export class EyeCandyModule {
}
