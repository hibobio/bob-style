import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ListOption } from '../list.interface';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import has from 'lodash/has';

@Component({
  selector: 'b-list-option',
  templateUrl: 'list-option.component.html',
  styleUrls: ['list-option.component.scss']
})
export class ListOptionComponent implements OnChanges {
  @ViewChild('prefixCompHost', { read: ViewContainerRef, static: true })
  prefixCompHost: ViewContainerRef;

  @Input() option: ListOption = null;
  @Input() searchValue: string;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnChanges(e: SimpleChanges): void {
    if (this.shouldRenderComponent(e)) {
      this.option = e.option.currentValue;
      this.renderComponent();
    }
    this.searchValue = get(e, 'searchValue.currentValue', '');
  }

  private renderComponent(): void {
    if (this.option.prefixComponent) {
      const component = this.option.prefixComponent.component;
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        component
      );
      const viewContainerRef = this.prefixCompHost;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
      const comp = componentRef.instance as any;
      const attr = this.option.prefixComponent.attributes;

      forEach(attr, (v, k) => {
        comp[k] = v;
      });
    } else {
      this.prefixCompHost.clear();
    }
  }

  private shouldRenderComponent(e: SimpleChanges): boolean {
    return (
      has(e, 'option') &&
      !e.option.currentValue.isPlaceHolder &&
      !isEqual(
        get(e.option.currentValue, 'prefixComponent'),
        get(e.option.previousValue, 'prefixComponent')
      )
    );
  }
}
