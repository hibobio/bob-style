import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '../../buttons/buttons.module';
import { ListFooterComponent } from './list-footer.component';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [
    ListFooterComponent,
  ],
  imports: [
    CommonModule,
    ButtonsModule,
    IconsModule,
  ],
  exports: [
    ListFooterComponent,
  ],
})
export class ListFooterModule {
}
