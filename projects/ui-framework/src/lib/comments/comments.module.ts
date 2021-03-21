import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AvatarModule } from '../avatar/avatar/avatar.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { InputModule } from '../form-elements/input/input.module';
import { MenuModule } from '../navigation/menu/menu.module';
import { FiltersModule } from '../services/filters/filters.module';
import { EventManagerPlugins } from '../services/utils/eventManager.plugins';
import { TypographyModule } from '../typography/typography.module';
import { CommentItemComponent } from './comment-list/comment-item/comment-item.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { EditCommentComponent } from './edit-comment/edit-comment.component';

@NgModule({
  declarations: [
    EditCommentComponent,
    CommentListComponent,
    CommentItemComponent,
  ],
  imports: [
    FiltersModule,
    TypographyModule,
    CommonModule,
    InputModule,
    AvatarModule,
    MatTooltipModule,
    ButtonsModule,
    MenuModule,
  ],
  exports: [EditCommentComponent, CommentListComponent],
  providers: [EventManagerPlugins[0]],
})
export class CommentsModule {}
