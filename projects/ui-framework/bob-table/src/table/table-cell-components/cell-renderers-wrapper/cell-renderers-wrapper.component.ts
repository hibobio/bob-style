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
    <span class="content-wrap">
      <ng-content></ng-content>
    </span>
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
<<<<<<< HEAD
        max-width: 100%;
=======
        min-width: 0;
      }
      .content-wrap {
        display: flex;
        min-width: 0;
>>>>>>> a90d75c77 (simple read more)
      }
    `,
  ],
})
export class CellRenderersWrapperComponent {
  @Input() componentRendererConfig: CellRenderersWrapperConfig;
}
