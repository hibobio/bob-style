import {
  ContentChildren,
  Directive,
  Input,
  NgModule,
  QueryList,
  TemplateRef,
} from '@angular/core';

/**
 <ng-container *contentTemplate="let data=data">
    {{ data.title }}
 </ng-container>

  <ng-container *ngTemplateOutlet="contentTemplate?.tpl;
                context: { data: item.data }">
  </ng-container>

  // multiple templates:

  <ng-container *contentTemplate="let data=data; name:'myTemplate'">
    {{ data.title }}
  </ng-container>

    <ng-container *ngTemplateOutlet="getContentTemplate('myTemplate');
                  context: { data: item.data }">
    </ng-container>
 */

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[contentTemplate]',
})
export class ContentTemplateDirective {
  constructor(public tpl: TemplateRef<any>) {}
  @Input() contentTemplateName: string;
}

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class ContentTemplateConsumer {
  @ContentChildren(ContentTemplateDirective)
  private _cntntTmplts: QueryList<ContentTemplateDirective>;
  public get contentTemplate() {
    return this._cntntTmplts?.first || ({} as any);
  }
  public getContentTemplate(name: string) {
    return (
      (this._cntntTmplts?.length &&
        this._cntntTmplts.find((dir) => {
          return dir.contentTemplateName === name;
        })) ||
      this.contentTemplate
    ).tpl;
  }
}

@NgModule({
  declarations: [ContentTemplateDirective],
  exports: [ContentTemplateDirective],
})
export class ContentTemplateModule {}
