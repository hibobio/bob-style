import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryBookLayoutComponent } from './story-book-layout.component';
import { TypographyModule } from '../typography/typography.module';

@NgModule({
  declarations: [
    StoryBookLayoutComponent,
  ],
  imports: [
    CommonModule,
    TypographyModule,
  ],
  exports: [
    StoryBookLayoutComponent,
  ],
  providers: [],
})
export class StoryBookLayoutModule {
}
