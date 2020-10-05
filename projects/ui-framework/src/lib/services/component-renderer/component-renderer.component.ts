import {
  Component,
  ViewChild,
  ViewContainerRef,
  Input,
  ComponentRef,
  Inject,
  Injector,
  ComponentFactory,
  ComponentFactoryResolver,
  Type,
  EventEmitter,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  RenderedComponent,
  RenderedComponentContent,
  RenderedComponentHandlers,
} from './component-renderer.interface';
import { GenericObject } from '../../types';
import { applyChanges, simpleChange } from '../utils/functional-utils';

@Component({
  selector: 'b-component-renderer',
  template: ` <ng-template #componentHost></ng-template> `,
  styles: [],
})
export class ComponentRendererComponent implements OnChanges, OnDestroy {
  constructor(
    @Inject(DOCUMENT) private document: any,
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  @ViewChild('componentHost', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() render: RenderedComponent;

  private componentRef: ComponentRef<any>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.render) {
      if (this.componentRef) {
        this.destroyComponent();
      }
      if (changes.render.currentValue) {
        this.insertComponent(changes.render.currentValue);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyComponent();
  }

  private resolveFactory(component: Type<any>): ComponentFactory<any> {
    return this.factoryResolver.resolveComponentFactory(component);
  }

  private resolveNgContent(content: RenderedComponentContent): any[] {
    if (!Array.isArray(content)) {
      content = [content];
    }
    const elements = content.map((cntnt) => {
      if (typeof cntnt === 'string') {
        return [this.document.createTextNode(cntnt)];
      }
      if (!!cntnt.component) {
        const transcomponent = this.createComponent(cntnt, false);
        return [transcomponent.location.nativeElement];
      }
    });
    return [...elements];
  }

  private resolveComponentAttributes(
    component: ComponentRef<any>,
    attributes: GenericObject
  ): SimpleChanges {
    const changes = simpleChange(attributes, true);
    applyChanges(component.instance, changes);
    return changes;
  }

  private resolveComponentHandlers(
    component: ComponentRef<any>,
    handlers: RenderedComponentHandlers
  ): ComponentRef<any> {
    for (const handler of Object.keys(handlers)) {
      if (component.instance[handler]) {
        component.instance[handler]
          .pipe(takeUntil(this.destroy$))
          .subscribe((event: EventEmitter<any>) => handlers[handler](event));
      }
    }
    return component;
  }

  private createComponent(
    comp: RenderedComponent,
    attach = false,
    container?: ViewContainerRef
  ): ComponentRef<any> {
    let component: ComponentRef<any>;

    const factory = this.resolveFactory(comp.component);

    const ngContent = comp.content
      ? this.resolveNgContent(comp.content)
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
      this.resolveComponentHandlers(component, comp.handlers);
    }

    if (!attach && component.hostView && !component.hostView.destroyed) {
      component.hostView.detectChanges();
    }

    return component;
  }

  private insertComponent(comp: RenderedComponent): void {
    this.reset();
    if (comp) {
      this.componentRef = this.createComponent(comp, true, this.container);
    }
  }

  private reset(): void {
    this.container?.clear();
  }

  private destroyComponent(): void {
    if (this.destroy$ && !this.destroy$.isStopped) {
      this.destroy$.next(true);
      this.destroy$.complete();
    }
    if (this.componentRef && !this.componentRef.hostView.destroyed) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
