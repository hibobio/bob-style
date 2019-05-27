import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesShowcaseComponent } from './employees-showcase.component';
import { AvatarModule } from '../avatar/avatar.module';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [EmployeesShowcaseComponent],
  imports: [CommonModule, AvatarModule, IconsModule],
  exports: [EmployeesShowcaseComponent],
  entryComponents: [EmployeesShowcaseComponent]
})
export class EmployeesShowcaseModule {
}
