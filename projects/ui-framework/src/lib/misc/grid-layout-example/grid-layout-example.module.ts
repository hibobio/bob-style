import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridLayoutExampleComponent } from './grid-layout-example.component';
import { InputModule } from '../../form-elements/input/input.module';
import { TypographyModule } from '../../typography/typography.module';

@NgModule({
  declarations: [
    GridLayoutExampleComponent,
  ],
  imports: [
    CommonModule,
    InputModule,
    TypographyModule,
  ],
  exports: [
    GridLayoutExampleComponent,
  ],
  providers: [],
})
export class GridLayoutExampleModule {
}
