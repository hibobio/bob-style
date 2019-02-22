import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from './utils.service';
import { WindowRef } from './window-ref.service';

@NgModule({
  imports: [CommonModule],
  providers: [UtilsService, WindowRef]
})
export class UtilsModule {}
