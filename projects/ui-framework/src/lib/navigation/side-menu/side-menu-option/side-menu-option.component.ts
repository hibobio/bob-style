import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { SideMenuOption } from './side-menu-option.interface';
import merge from 'lodash/merge';
import isUndefined from 'lodash/isUndefined';
import has from 'lodash/has';
import { IconColor, Icons } from '../../../icons/icons.enum';
import { ButtonType } from '../../../buttons-indicators/buttons/buttons.enum';

@Component({
  selector: 'b-side-menu-option',
  templateUrl: './side-menu-option.component.html',
  styleUrls: ['./side-menu-option.component.scss']
})
export class SideMenuOptionComponent implements OnChanges {
  @Input() option: SideMenuOption;
  @Input() selected: boolean;
  @Output() selectOption: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('prefix', { read: ViewContainerRef, static: true }) private prefix: ViewContainerRef;
  @ViewChild('postfix', { read: ViewContainerRef, static: false }) postfix: ViewContainerRef;

  private prefixComponent: any;

  public icons = Icons;
  public colors = IconColor;
  public types = ButtonType;
  public menuOpened: boolean;

  public showActions = false;

  constructor(private readonly componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'option.currentValue.prefix')) {
      this.renderComponent();
    }
  }

  private renderComponent(): void {
    if (isUndefined(this.prefixComponent)) {
      this.createComponent();
    }

    this.updateAttrs();
  }

  private createComponent() {
    const component = this.option.prefix.component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.prefix;
    viewContainerRef.clear();
    this.prefixComponent = viewContainerRef.createComponent(componentFactory);
  }

  private updateAttrs() {
    const instance = this.prefixComponent.instance as any;
    const attrs = this.option.prefix.attributes;
    merge(instance, attrs);
  }

  onSelectOption(): void {
    this.selectOption.emit(this.option.id);
  }

  stopBubbling($event): void {
    $event.stopPropagation();
  }

  setShowActions(status: boolean): void {
    this.showActions = status;
  }

  onActionClick(): void {
    this.setShowActions(false);
  }
}
