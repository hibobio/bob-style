import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TypographyModule } from '../../typography/typography.module';
import { CollapsibleComponent } from './collapsible.component';

@NgModule({
  declarations: [CollapsibleComponent],
  imports: [CommonModule, TypographyModule, MatExpansionModule],
  exports: [CollapsibleComponent]
})
export class CollapsibleModule {}
