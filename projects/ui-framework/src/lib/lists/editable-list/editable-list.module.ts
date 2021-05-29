import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonsModule } from '../../buttons/buttons.module';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { IconsModule } from '../../icons/icons.module';
import { MenuModule } from '../../navigation/menu/menu.module';
import { PagerModule } from '../../navigation/pager/pager.module';
import { CompactSearchModule } from '../../search/compact-search/compact-search.module';
import { SearchModule } from '../../search/search/search.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { NgLetModule } from '../../services/utils/nglet.directive';
import { EditableListComponent } from './editable-list.component';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ButtonsModule,
    InputMessageModule,
    TranslateModule,
    DragDropModule,
    FormsModule,
    MenuModule,
    PagerModule,
    NgLetModule,
    CompactSearchModule,
    SearchModule,
  ],
  declarations: [EditableListComponent],
  exports: [EditableListComponent],
  providers: [EventManagerPlugins[0]],
})
export class EditableListModule {}
