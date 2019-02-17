import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryBookLayoutComponent } from './story-book-layout.component';
import { TypographyModule } from '../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    StoryBookLayoutComponent,
  ],
  imports: [
    CommonModule,
    TypographyModule,
    BrowserAnimationsModule,
  ],
  exports: [
    StoryBookLayoutComponent,
  ],
  providers: [],
})
export class StoryBookLayoutModule {
}
