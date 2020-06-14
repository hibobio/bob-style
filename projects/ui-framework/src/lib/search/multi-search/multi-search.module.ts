import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSearchComponent } from './multi-search.component';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { IconsModule } from '../../icons/icons.module';
import { SearchModule } from '../search/search.module';

@NgModule({
  declarations: [MultiSearchComponent],
  imports: [
    CommonModule,
    ComponentRendererModule,
    AvatarModule,
    IconsModule,
    SearchModule,
  ],
  exports: [MultiSearchComponent],
  providers: [],
})
export class MultiSearchModule {}
