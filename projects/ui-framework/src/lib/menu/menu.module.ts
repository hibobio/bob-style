import { NgModule } from '@angular/core';
import { MenuComponent } from './menu.component';
import { MatMenuModule } from '@angular/material';

@NgModule({
  declarations: [MenuComponent],
  imports: [
    MatMenuModule,
  ],
  exports: [
    MenuComponent,
  ],
})
export class MenuModule {
}
