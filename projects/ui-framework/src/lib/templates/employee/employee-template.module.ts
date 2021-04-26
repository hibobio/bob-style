import { NgModule } from '@angular/core';
import { EmployeeTemplateComponent } from './employee-template.component';
import { CommonModule } from '@angular/common';

@NgModule({
  entryComponents: [EmployeeTemplateComponent],
  declarations: [EmployeeTemplateComponent],
  imports: [CommonModule],
  exports: [EmployeeTemplateComponent],
  providers: []
})
export class EmployeeTemplateModule {}
