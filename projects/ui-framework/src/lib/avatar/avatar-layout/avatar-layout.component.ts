import { Observable, Subscription } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';

import { ItemsInRowService } from '../../services/items-in-row/items-in-row.service';

@Component({
  selector: 'b-avatar-layout',
  templateUrl: './avatar-layout.component.html',
  styleUrls: ['./avatar-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarLayoutComponent implements AfterViewInit, OnDestroy {
  constructor(
    private elementRef: ElementRef,
    private itemsInRowService: ItemsInRowService
  ) {}

  @Input() align: 'center' | 'left' = 'center';
  @Output() itemsInRowChange = new EventEmitter<number>();

  gapSize = 8;
  elemWidth = 90;
  minItemsFallback = 3;
  itemsInRow$: Observable<number>;

  private sub: Subscription;

  ngAfterViewInit() {
    this.itemsInRow$ = this.itemsInRowService.getItemsInRow$({
      hostElem: this.elementRef.nativeElement,
      elemWidth: this.elemWidth,
      gapSize: this.gapSize,
      minItems: this.minItemsFallback,
      extended: false,
    });

    if (this.itemsInRowChange.observers.length > 0) {
      this.sub = this.itemsInRow$.subscribe((count) => {
        this.itemsInRowChange.emit(count);
      });
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
