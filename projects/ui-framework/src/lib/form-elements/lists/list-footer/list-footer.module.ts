import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { ListFooterComponent } from '../list-footer/list-footer.component';
import { IconsModule } from '../../../icons/icons.module';

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
