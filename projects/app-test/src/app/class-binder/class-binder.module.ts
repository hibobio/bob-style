import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DOMhelpers } from '../../../../ui-framework/src/lib/services/html/dom-helpers.service';
import { FormsModule } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'class-binder-tester',
  template: `
    <div style="width: 600px; margin: 40px auto 0; text-align: center;">
      <div
        #testDiv
        [ngClass]="classes"
        class="test {{ 'test2' }}"
        style="width:250px;padding:10px;border:2px solid black;margin:auto;"
      >
        {{ getClasses() }}
      </div>
      <p>
        <input #classInput type="text" [(ngModel)]="classes" />
      </p>
      <button type="button" (click)="addClasses()">add classes</button>
      <button type="button" (click)="removeClasses()">remove classes</button>
    </div>
  `,
  styles: ['']
})
export class ClassBinderTesterComponent implements AfterViewInit {
  constructor(private DOM: DOMhelpers) {}

  @ViewChild('testDiv') private testDiv: ElementRef;

  classes = '';

  addClasses() {
    this.DOM.bindClasses(this.testDiv.nativeElement, [
      'class1',
      'class2',
      'class3'
    ]);
  }

  removeClasses() {
    this.DOM.bindClasses(this.testDiv.nativeElement, {
      class1: false,
      class2: false,
      class3: false
    });
  }

  getClasses() {
    return this.testDiv ? this.testDiv.nativeElement.className : '';
  }

  ngAfterViewInit() {
    this.addClasses();
  }
}

@NgModule({
  declarations: [ClassBinderTesterComponent],
  exports: [ClassBinderTesterComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  entryComponents: []
})
export class ClassBinderTesterModule {}
