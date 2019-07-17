import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryBookLayoutComponent } from './story-book-layout.component';
import { TypographyModule } from '../typography/typography.module';
import { UtilComponentsModule } from '../services/util-components/utilComponents.module';

@NgModule({
  declarations: [StoryBookLayoutComponent],
  imports: [CommonModule, TypographyModule, UtilComponentsModule],
  exports: [StoryBookLayoutComponent],
  providers: []
})
export class StoryBookLayoutModule {}
