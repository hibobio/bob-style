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
  Type,
  ComponentRef
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { CardTableCellComponent } from './card-table.interface';

@Injectable()
export class ComponentFactoryService {
  container: ViewContainerRef;
  component: ComponentRef<any>;

  constructor(
    private factoryResolver: ComponentFactoryResolver,
    @Inject(DOCUMENT) private document: Document
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
    this.reset();
    const factory = this.resolveFactory(comp.component);

    const ngContent = comp.content
      ? this.resolveNgContent(comp.content)
      : undefined;

    this.component = this.container.createComponent(
      factory,
      undefined,
      undefined,
      ngContent
    );

    if (comp.attributes) {
      for (const attr of Object.keys(comp.attributes)) {
        this.component.instance[attr] = comp.attributes[attr];
      }
    }
  }

  destroyComponent(): void {
    this.component.destroy();
  }
}
