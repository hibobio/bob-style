import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicListComponent } from './basic-list.component';
import { IconsModule } from '../../icons/icons.module';
import { BasicListActionDirective } from './basic-list-action.directive';

@NgModule({
  declarations: [BasicListComponent, BasicListActionDirective],
  imports: [CommonModule, IconsModule],
  exports: [BasicListComponent, BasicListActionDirective],
})
export class BasicListModule {}
