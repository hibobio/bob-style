import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyModule } from '../../typography/typography.module';
import { CardAddComponent } from './card-add.component';

@NgModule({
  declarations: [CardAddComponent],
  imports: [CommonModule, TypographyModule],
  exports: [CardAddComponent],
  providers: []
})
export class CardAddModule {}
