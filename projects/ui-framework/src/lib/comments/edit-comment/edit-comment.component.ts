import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
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
import {
  FilterXSSOptions,
  SANITIZER_ALLOWED_ATTRS,
  SANITIZER_FILTER_XSS_OPTIONS,
  SanitizerService,
} from '../../services/html/sanitizer.service';
import { MentionsOption, MentionsService } from '../../services/mentions/mentions.service';
import { TributeInstance } from '../../services/mentions/tribute.interface';
import { eventHasMetaKey, hasChanges, isKey, notFirstChanges } from '../../services/utils/functional-utils';
import { CommentItem, CommentItemDto } from '../comments.interface';

export const HTML_COMMENT_SANITIZER_OPTIONS: Partial<FilterXSSOptions> = {
  whiteList: {
    ...SANITIZER_FILTER_XSS_OPTIONS.whiteList,
    a: SANITIZER_ALLOWED_ATTRS.filter((a) => a !== 'style'),
  },
};

@Component({
  selector: 'b-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['../../form-elements/input/input.component.scss', '../comments.scss', './edit-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCommentComponent implements OnChanges, AfterViewInit, OnDestroy {
  constructor(
    private kbrdCntrlSrvc: FormElementKeyboardCntrlService,
    private mentionsService: MentionsService,
    private sanitizer: SanitizerService
  ) {}

  @ViewChild('commentInput', { static: false }) commentInput: ElementRef;

  @Input() autoFocus = false;
  @Input() placeholder: string;
  @Input() comment: CommentItem;
  @Input() updateOnBlur = false;

  @Input() public mentionsList: MentionsOption[];

  @Output() sendComment: EventEmitter<CommentItemDto> = new EventEmitter<CommentItemDto>();

  readonly inputTypes = InputTypes;
  readonly avatarSize = AvatarSize;

  public get input(): HTMLInputElement {
    return this.commentInput?.nativeElement;
  }

  public get isHtml(): boolean {
    return Boolean(this.tribute || this.mentionsList);
  }

  public get value(): string {
    return this.input && this.input[this.isHtml ? 'innerHTML' : 'value'];
  }

  public set value(value: string) {
    this.input && (this.input[this.isHtml ? 'innerHTML' : 'value'] = value);
  }

  public tribute: TributeInstance;

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, ['comment'])) {
      this.value = !this.isHtml
        ? this.comment.content
        : this.sanitizer.sanitizeHtml(this.comment.content, HTML_COMMENT_SANITIZER_OPTIONS);
    }
    if (notFirstChanges(changes, ['mentionsList'])) {
      if (!this.tribute) {
        this.initMentions();
      } else {
        this.tribute.hideMenu();
        this.tribute.collection[0].values = this.mentionsList;
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.mentionsList && !this.tribute) {
      this.initMentions();
    }
    if (this.autoFocus) {
      this.focus();
    }
  }

  focus() {
    this.input.focus();
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
      this.kbrdCntrlSrvc.insertNewLineAtCursor(this.input);
    }
  }

  onBlur(): void {
    if (this.updateOnBlur) {
      this.updateCommentAndResetValue();
    }
  }

  private initMentions(): void {
    this.tribute = this.mentionsService.getTributeInstance(this.mentionsList, 'div');
    this.tribute.attach(this.input);
  }

  private updateCommentAndResetValue(): void {
    this.sendComment.emit({
      content: !this.isHtml ? this.value : this.sanitizer.sanitizeHtml(this.value, HTML_COMMENT_SANITIZER_OPTIONS),
    });
    this.value = '';
  }

  ngOnDestroy(): void {
    this.tribute?.detach(this.input);
  }
}
