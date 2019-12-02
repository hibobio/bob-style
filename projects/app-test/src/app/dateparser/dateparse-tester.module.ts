import { Component, NgModule, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DateParseService,
  DateInputDirectiveModule,
} from '../../../../ui-framework/src/public_api';
// tslint:disable-next-line: max-line-length
import { DateParseServiceTest } from '../../../../ui-framework/src/lib/form-elements/date-picker/date-parse-service/date-parse.service.mock';
// tslint:disable-next-line: max-line-length
import { DateInputDirective } from '../../../../ui-framework/src/lib/form-elements/date-picker/date-input-directive/dateinput.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

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
export class DateParseTesterComponent {
  constructor() {}

  @ViewChild(DateInputDirective, { static: true, read: ElementRef })
  input: ElementRef;

  formatStr: string = 'MMM/dd/yyyy';
  dateStr: string = '2010/5/3';

  formatVars = Object.keys(DateParseServiceTest);
  dateStrVars = Object.keys(DateParseServiceTest['dd/MM/yyyy']);

  onValueChange(value) {
    this.input.nativeElement.value = value;
    this.input.nativeElement.dispatchEvent(new Event('change'));
  }

  ngAfterViewInit() {
    // this.onValueChange(this.dateStr);
  }

  ngOnInit() {
    let counter = 0;

    // test 1

    console.time('test');

    Object.keys(DateParseServiceTest).forEach(format => {
      Object.keys(DateParseServiceTest[format])
        // .filter(k => DateParseServiceTest[format][k].only)
        .forEach(date => {
          const parsed = DateParseService.prototype.parseDate(
            format as any,
            date
          );

          const parsedStrict = DateParseService.prototype.parseDate(
            format as any,
            date,
            true
          );

          if (
            parsed.displayValue !== DateParseServiceTest[format][date].result
          ) {
            ++counter;

            const message =
              '=======> FAILED: ' +
              date +
              ' (' +
              format +
              ') => expected ' +
              DateParseServiceTest[format][date].result +
              ', instead saw: ' +
              parsed.displayValue;

            if (parsed.displayValue === null) {
              console.warn(message);
            } else {
              console.log(message);
            }
          }

          if (
            parsedStrict.displayValue !==
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
              parsedStrict.displayValue;

            if (parsedStrict.displayValue === null) {
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
