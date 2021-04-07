import { Component, Input } from '@angular/core';
import { CellRenderersWrapperConfig } from './cell-renderers-wrapper-config.interface';

@Component({
  selector: 'b-cell-renderers-wrapper',
  template: `
    <b-component-renderer
      class="prefix-cell-component"
      *ngIf="componentRendererConfig?.prefixComponentRenderer"
      [render]="componentRendererConfig.prefixComponentRenderer"
    ></b-component-renderer>
    <ng-content></ng-content>
    <b-component-renderer
      class="suffix-cell-component"
      *ngIf="componentRendererConfig?.suffixComponentRenderer"
      [render]="componentRendererConfig.suffixComponentRenderer"
    ></b-component-renderer>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class CellRenderersWrapperComponent {
  @Input() componentRendererConfig: CellRenderersWrapperConfig;
}
