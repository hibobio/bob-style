import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { URLutils } from './url-utils.service';

@NgModule({
  imports: [CommonModule],
  providers: [URLutils]
})
export class UrlUtilsModule {}
