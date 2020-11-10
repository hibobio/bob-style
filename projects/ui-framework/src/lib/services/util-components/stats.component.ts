import {
  Component,
  DoCheck,
  Input,
  HostListener,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { debounce } from 'lodash';
import { DOMhelpers } from '../html/dom-helpers.service';
import { countChildren } from '../utils/functional-utils';

@Component({
  selector: 'b-stats',
  template: `
    <p>
      changes: <span #counter1></span>&nbsp;<span
        class="cntr-diff"
        #counter2
      ></span>
      {{ changesCount() }}
    </p>
    <p *ngIf="countChildren">elements: <span #counter3></span></p>
  `,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
        background: rgba(255, 255, 255, 0.8);
        max-width: 120px;
        padding: 5px 10px;
        margin: 0;
        position: fixed;
        right: 15px;
        bottom: 15px;
        z-index: 100;
      }
      .cntr-diff {
        color: red;
      }
      .cntr-diff:before {
        content: '+';
      }
      .cntr-diff:empty {
        display: none;
      }
    `,
    'p { margin: 0; white-space: nowrap; }',
  ],
  providers: [],
})
export class StatsComponent implements DoCheck {
  constructor(private DOM: DOMhelpers, private zone: NgZone) {
    this.zone.runOutsideAngular(() => {
      this.dcu = debounce(() => {
        this.DOM.mutate(() => {
          this.counter2ElRef.nativeElement.innerHTML =
            this._changesCount1 - this._changesCount2 + '';
          this._changesCount2 = this._changesCount1;
        });
      }, 300);
    });
  }

  @ViewChild('counter1', { static: true }) counter1ElRef: ElementRef<
    HTMLElement
  >;
  @ViewChild('counter2', { static: true }) counter2ElRef: ElementRef<
    HTMLElement
  >;
  @ViewChild('counter3', { static: false }) counter3ElRef: ElementRef<
    HTMLElement
  >;

  private _changesCount1 = 0;
  private _changesCount2 = 0;
  public elementsCount = 0;

  private dcu: Function;

  @Input() rootElem = 'body';
  @Input() countChildren = false;

  @HostListener('click.outside-zone')
  onClick() {
    this.countKids();
  }

  ngDoCheck(): void {
    if (this.countChildren) {
      this.countKids();
    }
  }

  changesCount(): string {
    this.zone.runOutsideAngular(() => {
      this.DOM.mutate(() => {
        this.counter1ElRef.nativeElement.innerHTML = ++this._changesCount1 + '';
        this.dcu();
      });
    });
    return '';
  }

  countKids() {
    if (this.rootElem && this.counter3ElRef) {
      this.zone.runOutsideAngular(() => {
        this.DOM.measure(() => {
          this.elementsCount = countChildren(this.rootElem, null);
        });
        this.DOM.mutate(() => {
          this.counter3ElRef.nativeElement.innerHTML = this.elementsCount + '';
        });
      });
    }
  }
}
