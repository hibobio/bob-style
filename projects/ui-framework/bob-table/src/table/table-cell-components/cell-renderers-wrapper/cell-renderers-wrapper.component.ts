import { Component, Input } from '@angular/core';
import { CellRenderersWrapperConfig } from './cell-renderers-wrapper-config.interface';

@Component({
  selector: 'b-cell-renderers-wrapper',
  template: `
    <b-component-renderer
      class="prefix-cell-component mrg-r-8"
      *ngIf="componentRendererConfig?.prefixComponent"
      [render]="componentRendererConfig.prefixComponent"
    ></b-component-renderer>
    <ng-content></ng-content>
    <b-component-renderer
      class="suffix-cell-component mrg-l-8"
      *ngIf="componentRendererConfig?.suffixComponent"
      [render]="componentRendererConfig.suffixComponent"
    ></b-component-renderer>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
      }
    `,
  ],
})
export class CellRenderersWrapperComponent {
  @Input() componentRendererConfig: CellRenderersWrapperConfig;
}
