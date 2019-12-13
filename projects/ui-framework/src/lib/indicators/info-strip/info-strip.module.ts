import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoStripComponent } from './info-strip.component';
import { IconsModule } from '../../icons/icons.module';
import {LinkModule} from '../link/link.module';

@NgModule({
  declarations: [InfoStripComponent],
  imports: [
    CommonModule,
    IconsModule,
    LinkModule
  ],
  exports: [InfoStripComponent],
})
export class InfoStripModule { }
