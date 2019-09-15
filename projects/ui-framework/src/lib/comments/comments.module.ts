import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCommentComponent } from './edit-comment/edit-comment.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { InputModule } from '../form-elements/input/input.module';
import { AvatarModule } from '../avatar/avatar/avatar.module';
import { MatTooltipModule } from '@angular/material';
import { TextareaModule } from '../form-elements/textarea/textarea.module';
import { CommentItemComponent } from './comment-list/comment-item/comment-item.component';
import { ButtonsModule } from '../buttons/buttons.module';
import { MenuModule } from '../navigation/menu/menu.module';
import { TypographyModule } from '../typography/typography.module';
import { FiltersModule } from '../services/filters/filters.module';

@NgModule({
  declarations: [
    EditCommentComponent,
    CommentListComponent,
    CommentItemComponent
  ],
  imports: [
    FiltersModule,
    TypographyModule,
    CommonModule,
    InputModule,
    AvatarModule,
    MatTooltipModule,
    TextareaModule,
    ButtonsModule,
    MenuModule
  ],
  exports: [
    EditCommentComponent,
    CommentListComponent
  ]
})
export class CommentsModule { }
