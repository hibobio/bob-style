import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialComponent } from './social.component';
import { InputModule } from '../input/input.module';
import { IconsModule } from '../../icons/icons.module';
import { SocialService } from './social.service';


@NgModule({
  declarations: [
    SocialComponent
  ],
  imports: [
    CommonModule,
    InputModule,
    IconsModule,
  ],
  exports: [
    SocialComponent
  ],
  providers: [SocialService]
})
export class SocialModule {}
