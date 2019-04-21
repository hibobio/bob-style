import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar.component';
import { TypographyModule } from '../../typography/typography.module';

@NgModule({
  declarations: [
    AvatarComponent,
  ],
  imports: [
    CommonModule,
    TypographyModule,
  ],
  exports: [
    AvatarComponent,
  ],
  entryComponents: [
     AvatarComponent,
  ],
})
export class AvatarModule {
}
