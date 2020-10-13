import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestTableComponent } from './test-table.component';
import { TableModule } from '../../../../ui-framework/bob-table/src/table/table.module';
import { TestTableService } from './test-table.service';
import { TranslateService } from '@ngx-translate/core';
import { MultiSelectModule } from 'bob-style';

@NgModule({
  declarations: [TestTableComponent],
  exports: [TestTableComponent],
  imports: [CommonModule, TableModule, MultiSelectModule],
  providers: [TestTableService, TranslateService],
})
export class TestTableModule {}
