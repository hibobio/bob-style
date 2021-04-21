import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ReadMoreComponent } from './read-more.component';

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [ReadMoreComponent],
  exports: [ReadMoreComponent],
  providers: [],
})
export class ReadMoreModule {}
