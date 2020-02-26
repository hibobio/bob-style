import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from './utils.service';
import { WindowRef } from './window-ref.service';
import { DOMhelpers } from '../html/dom-helpers.service';
import { DocumentRef } from './document-ref.service';
import { SpyDirective } from './spy.directive';

@NgModule({
  declarations: [SpyDirective],
  exports: [SpyDirective],
  imports: [CommonModule],
  providers: [UtilsService, WindowRef, DocumentRef, DOMhelpers],
})
export class UtilsModule {}
