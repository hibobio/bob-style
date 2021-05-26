import {
  ContentChildren,
  Directive,
  Input,
  NgModule,
  QueryList,
  TemplateRef,
} from '@angular/core';

import { GenericObject } from '../../types';

/**
 <ng-container *contentTemplate="let data=data">
    {{ data.title }}
 </ng-container>

  <ng-container *ngTemplateOutlet="contentTemplate;
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

/**
 * Directive that facilitates passing custom templates to components from outside.
 * Don't forget to import ContentTemplateModule.
 * ```html
 * <ng-container *contentTemplate="let data=data; name:'myTemplate'">
 *   {{ data.title }}
 * </ng-container>
 * ```
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[contentTemplate]',
})
export class ContentTemplateDirective {
  constructor(public tpl: TemplateRef<any>) {}
  @Input() contentTemplateName: string;
}

/**
 * Extend this class to be able to use getContentTemplate method
 * in your component template
 */
@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class ContentTemplateConsumer {
  //
  @ContentChildren(ContentTemplateDirective)
  private _cntntTmplts: QueryList<ContentTemplateDirective>;
  private _tmpltsMap: GenericObject<TemplateRef<any>>;

  public get contentTemplate(): TemplateRef<any> {
    return this._cntntTmplts?.first?.tpl;
  }

  public get contentTemplates(): GenericObject<TemplateRef<any>> {
    return this._cntntTmplts?.length
      ? this._tmpltsMap ||
          (this._tmpltsMap = this._cntntTmplts.reduce((map, dir, idx) => {
            map[dir.contentTemplateName || idx] = dir.tpl;
            return map;
          }, {}))
      : {};
  }

  public getContentTemplate(name?: string) {
    return this.contentTemplates[name] || this.contentTemplate;
  }
}

@NgModule({
  declarations: [ContentTemplateDirective],
  exports: [ContentTemplateDirective],
})
export class ContentTemplateModule {}
