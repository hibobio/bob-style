import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MultiListAndListComponent } from './multi-list-and-list.component';
import { MultiListModule } from '../../lists/multi-list/multi-list.module';
import { BasicListModule } from '../../lists/basic-list/basic-list.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { MenuModule } from '../../navigation/menu/menu.module';

@NgModule({
  declarations: [MultiListAndListComponent],
  imports: [
    CommonModule,
    MultiListModule,
    TranslateModule,
    BasicListModule,
    ButtonsModule,
    MenuModule,
  ],
  exports: [MultiListAndListComponent],
  providers: [],
})
export class MultiListAndListModule {}
