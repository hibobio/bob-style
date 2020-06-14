import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[bCollapsibleHeader]'
})
export class CollapsibleHeaderDirective {
  constructor(public tpl: TemplateRef<any>) {
  }
}
