import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { TruncateTooltipType } from '../truncate-tooltip/truncate-tooltip.enum';
import { COMMON_EMOJIS, EMOJI_DATA } from './emoji-data.consts';
import { Emoji, EmojiCategory } from './emoji.interface';

@Component({
  selector: 'b-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmojiComponent implements OnInit {
  emojis: EmojiCategory[];
  commonEmojis: Emoji[];
  panelActive = false;
  readonly tooltipType = TruncateTooltipType;

  @Input() title: string;
  @Output() toggleClick: EventEmitter<boolean> = new EventEmitter();
  @Output() emojiSelect: EventEmitter<Emoji> = new EventEmitter();
  @ViewChild('overlayRef') panelElement: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.emojis = [...EMOJI_DATA];
    this.commonEmojis = [...COMMON_EMOJIS];
  }

  toggleMenu(forceState?: boolean) {
    this.panelActive =
      typeof forceState === 'boolean' ? forceState : !this.panelActive;
    if (
      !this.panelActive &&
      this.panelElement &&
      this.panelElement.overlayRef
    ) {
      this.panelElement.closePanel();
    }
    this.toggleClick.emit(this.panelActive);
    this.cdr.detectChanges();
  }

  selectEmoji(emoji: Emoji) {
    this.toggleMenu(false);
    setTimeout(() => {
      this.emojiSelect.emit(emoji);
    });
  }

  categoryTrackBy(index: number, category: EmojiCategory): string {
    return index + category.name;
  }

  emojiTrackBy(index: number, emoji: Emoji): string {
    return index + emoji.code;
  }
}
