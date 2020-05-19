import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '../../buttons/buttons.module';
import { ListFooterComponent } from './list-footer.component';
import { IconsModule } from '../../icons/icons.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ListFooterComponent],
  imports: [CommonModule, ButtonsModule, IconsModule, TranslateModule],
  exports: [ListFooterComponent],
})
export class ListFooterModule {}
