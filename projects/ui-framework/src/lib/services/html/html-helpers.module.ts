import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOMhelpers } from './dom-helpers.service';
import { HtmlParserHelpers } from './html-parser.service';

@NgModule({
  imports: [CommonModule],
  providers: [DOMhelpers, HtmlParserHelpers]
})
export class HtmlHelpersModule {}
