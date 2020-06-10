import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[bCollapsibleContent]'
})
export class CollapsibleContentDirective {
  constructor(public tpl: TemplateRef<any>) { }
}
