import { NgModule } from '@angular/core';
import { DateInputDirective } from './dateinput.directive';
import { DateParseService } from '../date-parse-service/date-parse.service';

@NgModule({
  declarations: [DateInputDirective],
  imports: [],
  exports: [DateInputDirective],
  providers: [DateParseService],
})
export class DateInputDirectiveModule {}
