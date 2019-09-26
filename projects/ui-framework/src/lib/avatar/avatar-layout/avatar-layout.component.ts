import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {DOMhelpers} from '../../services/utils/dom-helpers.service';
import {ItemsInRowService} from '../../services/items-in-row/items-in-row.service';

@Component({
  selector: 'b-avatar-layout',
  templateUrl: './avatar-layout.component.html',
  styleUrls: ['./avatar-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarLayoutComponent implements AfterViewInit {
  @Input() align: 'center' | 'left' = 'center';
  @Output() itemsInRowChange = new EventEmitter<number>();
  gapSize = 16;
  elemWidth = 100;
  itemsInRow$;
  constructor(
    private DOM: DOMhelpers,
    private elementRef: ElementRef,
    private itemsInRow: ItemsInRowService,
  ) { }

  ngAfterViewInit() {
    this.itemsInRow$ = this.itemsInRow.itemsInRowObserver$(
      this.elementRef.nativeElement,
      this.elemWidth,
      this.gapSize
    ).subscribe((count) => {
      this.DOM.setCssProps(this.elementRef.nativeElement, {
        '--item-count': count
      });
      this.itemsInRowChange.emit(count);
    });
  }

}
