import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommentItem } from '../comments.interface';

@Component({
  selector: 'b-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent {
  @Input() comments: CommentItem[];

  trackBy(index: number, comment: CommentItem): string {
    return comment.content;
  }
}
