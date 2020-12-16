import { DOCUMENT } from '@angular/common';
import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GenericObject } from '../../types';
import { applyChanges, asArray, simpleChange } from '../utils/functional-utils';
import {
  RenderedComponent,
  RenderedComponentContent,
  RenderedComponentHandlers,
} from './component-renderer.interface';

@Injectable({
  providedIn: 'root',
})
export class ComponentRendererService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  private resolveFactory<T = any>(component: Type<T>): ComponentFactory<T> {
    return this.factoryResolver.resolveComponentFactory(component);
  }

  private resolveNgContent(
    content: RenderedComponentContent,
    destroySubj: Subject<boolean>
  ): any[] {
    content = asArray(content);

    const elements = content.map((cntnt) => {
      if (typeof cntnt === 'string') {
        return [this.document.createTextNode(cntnt)];
      }
      if (!!cntnt.component) {
        const transcomponent = this.createComponent({
          comp: cntnt,
          attach: false,
          destroySubj,
        });
        return [transcomponent.location.nativeElement];
      }
    });
    return [...elements];
  }

  private resolveComponentAttributes<T = any>(
    component: ComponentRef<T>,
    attributes: GenericObject
  ): SimpleChanges {
    const changes = simpleChange(attributes, true);
    applyChanges(component.instance, changes, {}, [], false, {
      skipSetters: false,
    });
    return changes;
  }

  private resolveComponentHandlers<T = any>(
    component: ComponentRef<any>,
    handlers: RenderedComponentHandlers,
    destroySubj: Subject<boolean>
  ): ComponentRef<T> {
    for (const handler of Object.keys(handlers)) {
      if (component.instance[handler]) {
        component.instance[handler]
          .pipe(takeUntil(destroySubj))
          .subscribe((event: any) => handlers[handler](event));
      }
    }
    return component;
  }

  public createComponent({
    comp,
    attach = false,
    container = null,
    destroySubj,
  }: {
    comp: RenderedComponent;
    attach?: boolean;
    container?: ViewContainerRef;
    destroySubj: Subject<boolean>;
  }): ComponentRef<any> {
    let component: ComponentRef<any>;

    const factory = this.resolveFactory(comp.component);

    const ngContent = comp.content
      ? this.resolveNgContent(comp.content, destroySubj)
      : undefined;

    if (attach && container) {
      component = container.createComponent(
        factory,
        undefined,
        undefined,
        ngContent
      );
    } else {
      component = factory.create(this.injector, ngContent);
    }

    if (comp.attributes) {
      const changes = this.resolveComponentAttributes(
        component,
        comp.attributes
      );
      if (component.instance.ngOnChanges) {
        component.instance.ngOnChanges(changes);
      }
    }

    if (comp.handlers) {
      this.resolveComponentHandlers(component, comp.handlers, destroySubj);
    }

    if (!attach && component.hostView && !component.hostView.destroyed) {
      component.hostView.detectChanges();
    }

    return component;
  }
}
