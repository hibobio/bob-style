import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommentItem, CommentItemDto } from '../comments.interface';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { InputTypes } from '../../form-elements/input/input.enum';
import { eventHasMetaKey, isKey } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
// tslint:disable-next-line: max-line-length
import { FormElementKeyboardCntrlService } from '../../form-elements/services/keyboard-cntrl.service';

@Component({
  selector: 'b-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    '../comments.scss',
    './edit-comment.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCommentComponent implements AfterViewInit {
  constructor(private kbrdCntrlSrvc: FormElementKeyboardCntrlService) {}

  @Input() autoFocus = false;
  @Input() placeholder: string;
  @Input() comment: CommentItem;
  @Input() updateOnBlur = false;

  @Output() sendComment: EventEmitter<CommentItemDto> = new EventEmitter<
    CommentItemDto
  >();

  @ViewChild('commentInput', { static: true }) commentInput: ElementRef;

  readonly inputTypes = InputTypes;
  readonly avatarSize = AvatarSize;

  focus() {
    this.commentInput.nativeElement.focus();
  }

  enterPress(event: KeyboardEvent): void {
    if (isKey(event.key, Keys.enter)) {
      event.preventDefault();

      const inputEl = this.commentInput.nativeElement;

      if (eventHasMetaKey(event)) {
        this.kbrdCntrlSrvc.insertNewLineAtCursor(inputEl);
      } else {
        inputEl.blur();
        if (!this.updateOnBlur) {
          this.updateCommentAndResetValue();
        }
      }
    }
  }

  onBlur(): void {
    if (this.updateOnBlur) {
      this.updateCommentAndResetValue();
    }
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.focus();
    }
  }

  private updateCommentAndResetValue(): void {
    const inputEl = this.commentInput.nativeElement;
    this.sendComment.emit({ content: inputEl.value });

    inputEl.value = '';
  }
}
