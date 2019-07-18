import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextColoredLinksComponent } from './text-colored-links/text-colored-links.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TextColoredLinksComponent],
  exports: [
    TextColoredLinksComponent
  ]
})
export class TextColoredLinksModule { }
