import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[bListLayoutItem]' })
export class ListLayoutItemDirective {
  constructor(public tpl: TemplateRef<any>) { }
}
