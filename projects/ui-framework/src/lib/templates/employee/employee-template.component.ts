import { Component, HostBinding, Input } from '@angular/core';
import { EmployeeTemplateType } from './employee-template.enum';

@Component({
  selector: 'b-employee-template',
  templateUrl: './employee-template.component.html',
  styleUrls: ['./employee-template.component.scss']
})
export class EmployeeTemplateComponent {
  @HostBinding('attr.data-type') @Input() type: EmployeeTemplateType = EmployeeTemplateType.transparentSidebar;
  constructor() { }

}
