import {
  Component,
  DoCheck,
  Input,
  NgZone,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { countChildren } from '../utils/functional-utils';

@Component({
  selector: 'b-stats',
  template: `
    <span>changes: {{ changesCount }}</span>
    <span *ngIf="elementsCount > 0">elements: {{ elementsCount }}</span>
  `,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
        background: rgba(255, 255, 255, 0.8);
        max-width: 100px;
        padding: 5px 10px;
        margin: 0;
        position: fixed;
        right: 15px;
        bottom: 15px;
        z-index: 100;
      }
    `,
    'span {display:block; white-space:nowrap;}'
  ],
  providers: []
})
export class StatsComponent implements DoCheck {
  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}
  public changesCount = 0;
  public elementsCount = 0;

  @Input() rootElem = 'body';
  @Input() countChildren = false;

  @HostListener('click.outside-zone', ['$event'])
  onClick() {
    this.countKids();
    this.cd.detectChanges();
  }

  ngDoCheck(): void {
    ++this.changesCount;

    if (this.countChildren) {
      this.countKids();
    }
  }

  countKids() {
    if (this.rootElem) {
      this.elementsCount = countChildren(this.rootElem, null);
    }
  }
}
