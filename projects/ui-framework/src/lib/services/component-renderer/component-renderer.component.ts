import {
  Component,
  OnInit,
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
  OnDestroy
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import {
  RenderedComponent,
  RenderedComponentContent,
  RenderedComponentHandlers
} from './component-renderer.interface';

@Component({
  selector: 'b-component-renderer',
  template: `
    <ng-template #componentHost></ng-template>
  `,
  styles: []
})
export class ComponentRendererComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(DOCUMENT) private document: any,
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  @ViewChild('componentHost', { read: ViewContainerRef })
  container: ViewContainerRef;

  @Input() render: RenderedComponent;

  private componentRef: ComponentRef<any>;

  ngOnInit() {
    this.insertComponent(this.render);
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
    const elements = content.map(cntnt => {
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
    attributes: object
  ): ComponentRef<any> {
    for (const attr of Object.keys(attributes)) {
      component.instance[attr] = attributes[attr];
    }
    return component;
  }

  private resolveComponentHandlers(
    component: ComponentRef<any>,
    handlers: RenderedComponentHandlers
  ): ComponentRef<any> {
    for (const handler of Object.keys(handlers)) {
      component.instance[handler].subscribe((event: EventEmitter<any>) =>
        handlers[handler](event)
      );
    }
    return component;
  }

  private createComponent(
    comp: RenderedComponent,
    attach = false
  ): ComponentRef<any> {
    let component: ComponentRef<any>;

    const factory = this.resolveFactory(comp.component);

    const ngContent = comp.content
      ? this.resolveNgContent(comp.content)
      : undefined;

    if (attach) {
      component = this.container.createComponent(
        factory,
        undefined,
        undefined,
        ngContent
      );
    } else {
      component = factory.create(this.injector, ngContent);
    }

    if (comp.attributes) {
      this.resolveComponentAttributes(component, comp.attributes);
    }

    if (comp.handlers) {
      this.resolveComponentHandlers(component, comp.handlers);
    }

    if (!attach) {
      component.hostView.detectChanges();
    }

    return component;
  }

  private insertComponent(comp: RenderedComponent): void {
    this.reset();
    this.componentRef = this.createComponent(comp, true);
  }

  private reset(): void {
    this.container.clear();
  }

  private destroyComponent(): void {
    this.componentRef.destroy();
    this.componentRef = null;
  }
}
