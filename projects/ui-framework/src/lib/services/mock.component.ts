import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'b-mock',
  template: `
    <div class="mock-component" [ngStyle]="hostcss">
      <div #slot1 class="slot-1" [ngStyle]="slot1css" *ngIf="hasSlots[0]">
        <ng-content select="[slot1]"></ng-content>
      </div>
      <div #slot2 class="slot-2" [ngStyle]="slot2css" *ngIf="hasSlots[1]">
        <ng-content select="[slot2]"></ng-content>
      </div>
      <div #slot3 class="slot-3" [ngStyle]="slot3css" *ngIf="hasSlots[2]">
        <ng-content select="[slot3]"></ng-content>
      </div>
      <div #slot4 class="slot-4" [ngStyle]="slot4css" *ngIf="hasSlots[3]">
        <ng-content select="[slot4]"></ng-content>
      </div>
    </div>
  `,
  styles: [':host {display: block;']
})
export class MockComponent implements AfterViewInit {
  @Input() hostcss = {};
  @Input() slot1css = {};
  @Input() slot2css = {};
  @Input() slot3css = {};
  @Input() slot4css = {};

  @ViewChild('slot1') slot1: ElementRef;
  @ViewChild('slot2') slot2: ElementRef;
  @ViewChild('slot3') slot3: ElementRef;
  @ViewChild('slot4') slot4: ElementRef;

  hasSlots = [true, true, true, true];

  private isEmpty(element: ElementRef) {
    return (
      element.nativeElement.children.length !== 0 ||
      element.nativeElement.childNodes.length !== 0
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasSlots[0] = this.isEmpty(this.slot1) ? true : false;
      this.hasSlots[1] = this.isEmpty(this.slot2) ? true : false;
      this.hasSlots[2] = this.isEmpty(this.slot3) ? true : false;
      this.hasSlots[3] = this.isEmpty(this.slot4) ? true : false;
    }, 0);
  }
}
