import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MasonryItemComponent,
  MasonryLayoutComponent,
} from './masonry.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MasonryLayoutComponent, MasonryItemComponent],
  exports: [MasonryLayoutComponent, MasonryItemComponent],
  providers: [],
})
export class MasonryLayoutModule {}
