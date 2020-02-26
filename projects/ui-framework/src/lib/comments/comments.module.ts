import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCommentComponent } from './edit-comment/edit-comment.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { InputModule } from '../form-elements/input/input.module';
import { AvatarModule } from '../avatar/avatar/avatar.module';
import { CommentItemComponent } from './comment-list/comment-item/comment-item.component';
import { ButtonsModule } from '../buttons/buttons.module';
import { MenuModule } from '../navigation/menu/menu.module';
import { TypographyModule } from '../typography/typography.module';
import { FiltersModule } from '../services/filters/filters.module';
import { MatTooltipModule } from '@angular/material/tooltip';

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
})
export class CommentsModule {}
