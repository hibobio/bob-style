import { NgModule } from '@angular/core';
import { MenuComponent } from './menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [MenuComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [MenuComponent],
  providers: [EventManagerPlugins[0]],
})
export class MenuModule {}
