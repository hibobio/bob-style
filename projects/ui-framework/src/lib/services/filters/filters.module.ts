import { NgModule } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';
import { LinkifyPipe } from './linkify.pipe';
import { FormatNumberPipe } from './formatNumber.pipe';
import { CapitalizeAllPipe, CapitalizePipe } from './capitalize.pipe';

@NgModule({
  imports: [],
  declarations: [
    HighlightPipe,
    LinkifyPipe,
    FormatNumberPipe,
    CapitalizePipe,
    CapitalizeAllPipe,
  ],
  exports: [
    HighlightPipe,
    LinkifyPipe,
    FormatNumberPipe,
    CapitalizePipe,
    CapitalizeAllPipe,
  ],
})
export class FiltersModule {}
