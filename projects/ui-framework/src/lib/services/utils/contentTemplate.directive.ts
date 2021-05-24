import { ContentChild, Directive, NgModule, TemplateRef } from '@angular/core';

export interface ContentTemplateConsumer {
  contentTemplate: ContentTemplateDirective;
}

/**
 <ng-container *contentTemplate="let data=data">
    {{ data.title }}
 </ng-container>

  <ng-container *ngTemplateOutlet="contentTemplate?.tpl;
                context: { data: item.data }">
  </ng-container>
 */

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[contentTemplate]',
})
export class ContentTemplateDirective {
  constructor(public tpl: TemplateRef<any>) {}
}

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class ContentTemplateConsumer
  implements ContentTemplateConsumer {
  @ContentChild(ContentTemplateDirective, { static: true })
  contentTemplate!: ContentTemplateDirective;
}

@NgModule({
  declarations: [ContentTemplateDirective],
  exports: [ContentTemplateDirective],
})
export class ContentTemplateModule {}
