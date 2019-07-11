import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnInit,
  Input,
  OnDestroy,
  ComponentRef,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { TruncateTooltipComponent } from './truncate-tooltip.component';

@Directive({
  selector: '[bTruncateTooltip]'
})
export class TruncateTooltipDirective implements OnChanges, OnInit, OnDestroy {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {}

  private tooltipComponent: ComponentRef<any>;
  private initialized = false;
  public expectChanges = true;

  @Input() bTruncateTooltip = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.initialized &&
      changes.bTruncateTooltip &&
      !changes.bTruncateTooltip.firstChange
    ) {
      this.bTruncateTooltip = changes.bTruncateTooltip.currentValue;
      this.tooltipComponent.instance.maxLines = this.bTruncateTooltip;
    }
  }

  ngOnInit(): void {
    const factory = this.resolver.resolveComponentFactory(
      TruncateTooltipComponent
    );
    this.tooltipComponent = this.viewContainer.createComponent(factory);
    this.tooltipComponent.instance.maxLines = this.bTruncateTooltip || 1;
    this.tooltipComponent.instance.expectChanges = this.expectChanges;
    this.tooltipComponent.instance.child.createEmbeddedView(this.templateRef);
    this.initialized = true;
  }

  ngOnDestroy(): void {
    this.tooltipComponent.destroy();
    this.tooltipComponent = null;
  }
}
