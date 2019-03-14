import { NgModule } from '@angular/core';
import { MenuComponent } from './menu.component';
import { MatMenuModule } from '@angular/material';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    MatMenuModule,
  ],
  exports: [
    MenuComponent,
  ],
})
export class MenuModule {
}
