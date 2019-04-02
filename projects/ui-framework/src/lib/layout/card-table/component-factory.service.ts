// sources:
// https://stackblitz.com/edit/dynamic-component-example
// https://stackblitz.com/edit/dynamic-ng-content-l9cfn6
// https://stackoverflow.com/questions/41975810/content-projection-in-dynamic-angular-components
// https://angular.io/api/core/ViewContainerRef#!#createComponent-anchor

import {
  Injectable,
  Inject,
  ComponentFactoryResolver,
  ViewContainerRef,
  Type
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { CardTableCellComponent } from './card-table.interface';

@Injectable()
export class ComponentFactoryService {
  container: ViewContainerRef;

  constructor(
    private factoryResolver: ComponentFactoryResolver,
    @Inject(DOCUMENT) private document: any
  ) {}

  setComponentContainerRef(view: ViewContainerRef): void {
    this.container = view;
  }

  private resolveFactory(component: Type<any>) {
    return this.factoryResolver.resolveComponentFactory(component);
  }

  private resolveNgContent(content: string) {
    const element = this.document.createTextNode(content);
    return [[element]];
  }

  reset(): void {
    this.container.clear();
  }

  insertComponent(comp: CardTableCellComponent): void {
    const factory = this.resolveFactory(comp.component);

    const ngContent = comp.content
      ? this.resolveNgContent(comp.content)
      : undefined;

    const component = this.container.createComponent(
      factory,
      undefined,
      undefined,
      ngContent
    ).instance as any;

    if (comp.attributes) {
      for (const attr of Object.keys(comp.attributes)) {
        component[attr] = comp.attributes[attr];
      }
    }
  }
}
