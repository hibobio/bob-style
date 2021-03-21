import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { AvatarSize } from '../../../avatar/avatar/avatar.enum';
import { ButtonSize, ButtonType } from '../../../buttons/buttons.enum';
import { IconColor, Icons } from '../../../icons/icons.enum';
import { hasChanges } from '../../../services/utils/functional-utils';
import { COMMENT_EQ_CHECK } from '../../comments.const';
import { CommentItem } from '../../comments.interface';
import { CommentsUtilService } from '../../comments.service';

@Component({
  selector: 'b-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['../../comments.scss', './comment-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CommentsUtilService],
})
export class CommentItemComponent implements OnChanges, AfterViewInit {
  constructor(
    private zone: NgZone,
    private router: Router,
    private commentsUtilService: CommentsUtilService
  ) {}

  @Input() comment: CommentItem;

  @ViewChild('commentContent', { static: false }) contentElRef: ElementRef<
    HTMLDivElement
  >;

  public menuOpen = false;

  readonly avatarSize = AvatarSize;
  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly buttonSize = ButtonSize;

  private value: string;

  private get content(): HTMLTextAreaElement | HTMLDivElement {
    return this.contentElRef?.nativeElement;
  }

  private set contentValue(value: string) {
    this.content && (this.content.innerHTML = value);
  }

  @HostListener('click.outside-zone', ['$event'])
  onHostClick($event: MouseEvent) {
    const employeeId = ($event.target as HTMLElement).getAttribute(
      'mention-employee-id'
    );

    if (employeeId) {
      $event.preventDefault();
      this.zone.run(() => {
        this.router.navigate(['/employee-profile', employeeId]);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      hasChanges(changes, ['comment'], false, {
        checkEquality: true,
        equalCheck: COMMENT_EQ_CHECK,
      })
    ) {
      this.value = this.commentsUtilService.sanitizeValue(
        this.comment?.content
      );
    }
  }

  ngAfterViewInit(): void {
    this.contentValue = this.value;
  }

  closeMenu() {
    setTimeout(() => {
      this.menuOpen = false;
    });
  }
}
