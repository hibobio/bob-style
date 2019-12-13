import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[bBasicListAction]'
})
export class BasicListActionDirective {
  constructor(public tpl: TemplateRef<any>) { }
}
