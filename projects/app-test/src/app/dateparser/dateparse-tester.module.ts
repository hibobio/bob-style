import {
  Component,
  NgModule,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line: max-line-length
import { DateParseServiceTest } from '../../../../ui-framework/src/lib/form-elements/date-picker/date-parse-service/date-parse.service.mock';
// tslint:disable-next-line: max-line-length
import { DateInputDirective } from '../../../../ui-framework/src/lib/form-elements/date-picker/date-input-directive/dateinput.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DateParseService } from '../../../../ui-framework/src/lib/form-elements/date-picker/date-parse-service/date-parse.service';
import { DateInputDirectiveModule } from '../../../../ui-framework/src/lib/form-elements/date-picker/date-input-directive/dateinput.directive.module';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'date-parse-tester',
  template: `
    <div
      style="width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;"
    >
      <select [(ngModel)]="formatStr">
        <option *ngFor="let frmt of formatVars" [value]="frmt">{{
          frmt
        }}</option>
      </select>

      <br /><br />

      <input type="text" [bDateInput]="formatStr" />

      <br /><br />
      <select
        [(ngModel)]="dateStr"
        (change)="onValueChange($event.target.value)"
      >
        <option *ngFor="let date of dateStrVars" [value]="date">{{
          date
        }}</option>
      </select>
    </div>
  `,
  providers: [],
})
export class DateParseTesterComponent implements AfterViewInit, OnInit {
  constructor() {}

  @ViewChild(DateInputDirective, { static: true, read: ElementRef })
  input: ElementRef;

  formatStr = 'MMM/dd/yyyy';
  dateStr = '2010/5/3';

  formatVars = Object.keys(DateParseServiceTest);
  dateStrVars = Object.keys(DateParseServiceTest['dd/MM/yyyy']);

  onValueChange(value) {
    this.input.nativeElement.value = value;
    this.input.nativeElement.dispatchEvent(new Event('change'));
  }

  ngAfterViewInit() {
    this.onValueChange(this.dateStr);
  }

  ngOnInit() {
    const doTest = true;

    if (doTest) {
      let counter = 0;

      console.time('test');
      Object.keys(DateParseServiceTest).forEach(format => {
        Object.keys(DateParseServiceTest[format])
          // .filter(k => DateParseServiceTest[format][k].only)
          .forEach(date => {
            const parsed = DateParseService.prototype.parseDate(
              format as any,
              date,
              false
            );

            if (parsed.value !== DateParseServiceTest[format][date].result) {
              ++counter;

              const message =
                '=======> FAILED: ' +
                date +
                ' (' +
                format +
                ') => expected ' +
                DateParseServiceTest[format][date].result +
                ', instead saw: ' +
                parsed.value;

              if (parsed.value === null) {
                console.warn(message);
              } else {
                console.log(message);
              }
            }

            const parsedStrict = DateParseService.prototype.parseDate(
              format as any,
              date,
              true
            );

            if (
              parsedStrict.value !==
              DateParseServiceTest[format][date].resultStrict
            ) {
              ++counter;

              const message =
                '=======> FAILED STRICT: ' +
                date +
                ' (' +
                format +
                ') => expected ' +
                DateParseServiceTest[format][date].resultStrict +
                ', instead saw: ' +
                parsedStrict.value;

              if (parsedStrict.value === null) {
                console.warn(message);
              } else {
                console.log(message);
              }
            }
          });
      });
      console.timeEnd('test');

      console.log('TOTAL FAILED: ', counter);
    }
  }
}

@NgModule({
  declarations: [DateParseTesterComponent],
  imports: [
    BrowserModule,
    CommonModule,
    DateInputDirectiveModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [DateParseTesterComponent],
  providers: [],
  entryComponents: [],
})
export class DateParseTesterModule {}
