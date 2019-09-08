import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommentItem, CommentItemDto} from '../comments.interface';
import {AvatarSize} from '../../avatar/avatar/avatar.enum';
import {InputTypes} from '../../form-elements/input/input.enum';

@Component({
  selector: 'b-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: [
    '../comments.scss',
    './edit-comment.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCommentComponent implements AfterViewInit {
  inputTypes = InputTypes;
  avatarSize = AvatarSize;
  @Input() autoFocus = false;
  @Input() placeholder: string;
  @Input() comment: CommentItem;
  @Output() sendComment: EventEmitter<CommentItemDto> = new EventEmitter<CommentItemDto>();
  @ViewChild('commentInput', {static: true}) commentInput: HTMLInputElement;

  focus() {
    this.commentInput.focus();
  }

  enterPress($event): void {
    if ($event.shiftKey === false) {
      this.doneCommenting();
      setTimeout(() => {
        this.commentInput.value = null;
      });
    }
  }
  private doneCommenting(): void {
    this.sendComment.emit({content: this.commentInput.value});
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.focus();
    }
  }

}
