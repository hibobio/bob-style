import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockComponent } from './mock.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MockComponent],
  exports: [MockComponent],
  providers: [],
})
export class MockComponentModule {}
