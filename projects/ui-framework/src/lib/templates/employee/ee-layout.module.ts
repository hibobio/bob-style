import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { EELayoutComponent } from './ee-layout.component';

@NgModule({
  declarations: [EELayoutComponent],
  exports: [EELayoutComponent],
  imports: [CommonModule, AvatarModule],
  providers: [],
})
export class EELayoutModule {}
