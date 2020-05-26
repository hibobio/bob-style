import { NgModule } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';
import { LinkifyPipe } from './linkify.pipe';
import { FormatNumberPipe } from './formatNumber.pipe';

@NgModule({
  imports: [],
  declarations: [HighlightPipe, LinkifyPipe, FormatNumberPipe],
  exports: [HighlightPipe, LinkifyPipe, FormatNumberPipe],
})
export class FiltersModule {}
