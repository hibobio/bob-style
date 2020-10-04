import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from './utils.service';
import { WindowRef } from './window-ref.service';
import { DOMhelpers } from '../html/dom-helpers.service';
import { DocumentRef } from './document-ref.service';
import { SpyModule } from './spy.directive';
import { InViewModule } from './inview.directive';

@NgModule({
  declarations: [],
  exports: [],
  imports: [CommonModule, SpyModule, InViewModule],
  providers: [UtilsService, WindowRef, DocumentRef, DOMhelpers],
})
export class UtilsModule {}
