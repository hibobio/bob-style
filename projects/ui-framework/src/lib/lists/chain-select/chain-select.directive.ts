import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[bChainSelect]'
})
export class ChainSelectDirective {
  constructor(public tpl: TemplateRef<any>) { }
}
