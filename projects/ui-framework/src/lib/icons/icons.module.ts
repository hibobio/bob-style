import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { IconComponent } from './icon.component';
import { CommonModule } from '@angular/common';

@NgModule({
  entryComponents: [IconComponent],
  declarations: [IconComponent],
  imports: [HttpClientModule, CommonModule, MatIconModule, MatTooltipModule],
  exports: [IconComponent],
  providers: []
})
export class IconsModule {}
