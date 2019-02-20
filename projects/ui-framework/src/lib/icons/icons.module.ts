import { NgModule } from '@angular/core';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { IconComponent } from './icon.component';
import { IconService } from './icon.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [IconComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [
    IconComponent,
  ],
  providers: [
    IconService,
  ],
})
export class IconsModule {
}
