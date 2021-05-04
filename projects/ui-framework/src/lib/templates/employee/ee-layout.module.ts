import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { EELayoutComponent } from './ee-layout.component';

@NgModule({
  declarations: [EELayoutComponent],
  exports: [EELayoutComponent],
  imports: [CommonModule, AvatarModule],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EELayoutModule {}
