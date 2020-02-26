import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from './utils.service';
import { WindowRef } from './window-ref.service';
import { DOMhelpers } from '../html/dom-helpers.service';
import { DocumentRef } from './document-ref.service';

@NgModule({
  declarations: [],
  exports: [],
  imports: [CommonModule],
  providers: [UtilsService, WindowRef, DocumentRef, DOMhelpers],
})
export class UtilsModule {}
