import { NgModule, Component, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockComponent } from './mock.component';
import { UtilsModule } from '../utils/utils.module';
import { DOMhelpers } from '../utils/dom-helpers.service';

@Component({
  selector: 'b-stats',
  template: `
    <span>changes: {{ changesCount }}</span>
  `,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
        background: rgba(255, 255, 255, 0.8);
        max-width: 100px;
        padding: 5px 10px;
        margin: 20px auto;
        position: fixed;
        right: 20px;
        top: 5px;
      }
    `
  ],
  providers: []
})
export class StatsComponent implements DoCheck {
  constructor() {}
  public changesCount = 0;

  ngDoCheck(): void {
    ++this.changesCount;
  }
}

@NgModule({
  imports: [CommonModule, UtilsModule],
  declarations: [MockComponent, StatsComponent],
  exports: [MockComponent, StatsComponent],
  providers: [DOMhelpers]
})
export class UtilComponentsModule {}
