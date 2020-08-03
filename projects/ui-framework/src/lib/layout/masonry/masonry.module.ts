import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MasonryItemComponent,
  MasonryLayoutComponent,
} from './masonry.component';
import { MasonryService } from './masonry.service';

@NgModule({
  imports: [CommonModule],
  declarations: [MasonryLayoutComponent, MasonryItemComponent],
  exports: [MasonryLayoutComponent, MasonryItemComponent],
  providers: [MasonryService],
})
export class MasonryLayoutModule {}
