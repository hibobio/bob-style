import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickFilterLayoutComponent } from './quick-filter-layout.component';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [QuickFilterLayoutComponent],
  imports: [CommonModule, IconsModule],
  providers: [],
  exports: [QuickFilterLayoutComponent],
})
export class QuickFilterLayoutModule {}
