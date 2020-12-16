import {
  Component,
  ViewChild,
  ViewContainerRef,
  Input,
  ComponentRef,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { RenderedComponent } from './component-renderer.interface';
import { ComponentRendererService } from './component-renderer.service';

@Component({
  selector: 'b-component-renderer',
  template: ` <ng-template #componentHost></ng-template> `,
  styles: [],
})
export class ComponentRendererComponent implements OnChanges, OnDestroy {
  constructor(private service: ComponentRendererService) {}

  @ViewChild('componentHost', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  @Input() render: RenderedComponent;

  private destroy$: Subject<boolean> = new Subject<boolean>();
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

  private insertComponent(comp: RenderedComponent): void {
    this.reset();
    if (comp) {
      this.componentRef = this.service.createComponent({
        comp,
        attach: true,
        container: this.container,
        destroySubj: this.destroy$,
      });
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
