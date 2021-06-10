import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { Keys } from '../../enums';
import { InputTypes } from '../../form-elements/input/input.enum';
// tslint:disable-next-line: max-line-length
import { FormElementKeyboardCntrlService } from '../../form-elements/services/keyboard-cntrl.service';
import { Emoji } from '../../popups/emoji/emoji.interface';
import { HTML_TEST } from '../../services/html/html-parser.const';
import {
  MentionsOption,
  MentionsService,
} from '../../services/mentions/mentions.service';
import { TributeInstance } from '../../services/mentions/tribute.interface';
import {
  eventHasMetaKey,
  hasChanges,
  isKey,
  notFirstChanges,
} from '../../services/utils/functional-utils';
import { COMMENT_EQ_CHECK, MENTIONS_LIST_EQ_CHECK } from '../comments.const';
import { CommentItem, CommentItemDto, CommentType } from '../comments.interface';
import { CommentsUtilService } from '../comments.service';

@Component({
  selector: 'b-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    '../comments.scss',
    './edit-comment.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CommentsUtilService],
})
export class EditCommentComponent
  implements OnChanges, AfterViewInit, OnDestroy, AfterContentChecked {
  constructor(
    private kbrdCntrlSrvc: FormElementKeyboardCntrlService,
    private mentionsService: MentionsService,
    private commentsUtilService: CommentsUtilService
  ) {}

  @ViewChild('commentInput', { static: false }) commentInput: ElementRef<
    HTMLTextAreaElement | HTMLDivElement
  >;

  @Input() placeholder: string;
  @Input() comment: CommentItem;

  @Input() autoFocus = false;
  @Input() updateOnBlur = false;

  @Input() public mentionsList: MentionsOption[];
  @Input() showEmoji = true; 
  @HostBinding('attr.data-type') @Input() type: CommentType = CommentType.inputRadius; 
  @Output()
  sendComment: EventEmitter<CommentItemDto> = new EventEmitter();

  readonly inputTypes = InputTypes;
  readonly avatarSize = AvatarSize;

  public get input(): HTMLTextAreaElement | HTMLDivElement {
    return this.commentInput?.nativeElement;
  }

  public get isHtml(): boolean {
    return (
      Boolean(this.tribute || this.mentionsList?.length) ||
      HTML_TEST.test(this.comment?.content)
    );
  }

  public value: string;

  public get inputValue(): string {
    return this.input && this.input[this.isHtml ? 'innerHTML' : 'value'];
  }

  public set inputValue(value: string) {
    this.input && (this.input[this.isHtml ? 'innerHTML' : 'value'] = value);
  }
  private lastCaretInputCommentPosition: number;

  public tribute: TributeInstance;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      hasChanges(changes, ['comment'], false, {
        checkEquality: true,
        equalCheck: COMMENT_EQ_CHECK,
      })
    ) {
      this.value = this.inputValue = this.commentsUtilService.sanitizeValue(
        this.comment?.content,
        this.isHtml,
        true
      );
    }

    if (
      notFirstChanges(changes, ['mentionsList'], false, {
        checkEquality: true,
        equalCheck: MENTIONS_LIST_EQ_CHECK,
      })
    ) {
      if (!this.tribute) {
        this.initMentions();
      } else if (this.mentionsList?.length) {
        this.tribute.hideMenu();
        this.tribute.collection[0].values = this.mentionsList;
      } else {
        this.ngOnDestroy();
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.mentionsList?.length && !this.tribute) {
      this.initMentions();
    }
    if (this.autoFocus) {
      this.focus();
    }
    this.inputValue = this.value;
  }

  ngAfterContentChecked() {
    if (this.type !== CommentType.inputRadius || !this.commentInput) { return; }
    const textarea = this.commentInput.nativeElement as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    if (textarea.value.split(/\r*\n/).length <= 1) {
      textarea.style.height = '40px'
      return;
    }
    textarea.style.height = textarea.scrollHeight + 'px';      
  }

  addEmoji(code: Emoji): void {
    const textBeforeEmoji = this.inputValue.slice(0, this.lastCaretInputCommentPosition);
    const textAfterEmoji = this.inputValue.slice(this.lastCaretInputCommentPosition)
    this.inputValue = textBeforeEmoji + code.icon + textAfterEmoji;
  }

  get canDisplayEmoji(): boolean {
    return this.showEmoji && this.type == CommentType.inputRadius;
  }

  focus() {
    this.input.focus();
  }

  onInputChange(): void {
    this.value = this.inputValue;
  }

  enterPress(event: KeyboardEvent): void {
    if (!isKey(event.key, Keys.enter) || this.tribute?.isActive) {
      return;
    }

    if (!eventHasMetaKey(event)) {
      event.preventDefault();
      this.input.blur();
      if (!this.updateOnBlur) {
        this.updateCommentAndResetValue();
      }
      return;
    }

    if (eventHasMetaKey(event) && !this.isHtml) {
      event.preventDefault();
      this.kbrdCntrlSrvc.insertNewLineAtCursor(<HTMLTextAreaElement>this.input);
    }
  }

  onBlur(): void {
    if (!this.isHtml) {
      this.lastCaretInputCommentPosition = this.kbrdCntrlSrvc.
      getInputCursorState(this.commentInput.nativeElement as HTMLTextAreaElement).selectionStart;
    }
    if (this.updateOnBlur) {
      this.updateCommentAndResetValue();
    }
  }

  private initMentions(): void {
    this.tribute = this.mentionsService.getTributeInstance(
      this.mentionsList,
      'div'
    );
    this.tribute.attach(this.input);
  }

  private updateCommentAndResetValue(): void {
    this.sendComment.emit({
      content: this.commentsUtilService.sanitizeValue(
        this.inputValue,
        this.isHtml,
        false
      ),
    });
    this.value = this.inputValue = '';
  }

  ngOnDestroy(): void {
    this.tribute?.detach(this.input);
    this.mentionsList = this.tribute = undefined;
  }
}
