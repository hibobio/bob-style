import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MenuItem } from './menu.interface';
import { MenuPositionX, MatMenu } from '@angular/material/menu';
import {
  isFunction,
  hasChanges,
  applyChanges,
  notFirstChanges,
  isValuevy,
} from '../../services/utils/functional-utils';

@Component({
  selector: 'b-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnChanges, OnInit {
  constructor(private cd: ChangeDetectorRef) {}

  @Input() id: string;
  @Input() data: any;
  @Input() menu: MenuItem[];
  @Input() openLeft = false;
  @Input() clickToOpenSub = false;
  @Input() panelClass: string;
  @Input() disabled: boolean;

  @Output() actionClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
  @Output() openMenu: EventEmitter<string | void> = new EventEmitter<
    string | void
  >();
  @Output() closeMenu: EventEmitter<string | void> = new EventEmitter<
    string | void
  >();

  @ViewChild('childMenu', { static: true }) public childMenu: MatMenu;

  public menuDir: MenuPositionX = 'after';
  public menuViewModel: MenuItem[];

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (hasChanges(changes, ['openLeft'])) {
      this.menuDir = this.openLeft ? 'before' : 'after';
    }

    if (
      hasChanges(changes, ['menu', 'id', 'data', 'clickToOpenSub'], true, {
        falseyCheck: isValuevy,
      })
    ) {
      this.setViewModel();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    if (this.menu && !this.menuViewModel) {
      this.setViewModel();
      this.cd.detectChanges();
    }
  }

  public onClick(child: MenuItem, triggerAction = true): void {
    if (this.actionClick.observers.length > 0) {
      this.actionClick.emit(child);
    }

    if (child.action && triggerAction) {
      child.action(child);
    }
  }

  public onOpenMenu(): void {
    if (this.openMenu.observers.length > 0) {
      this.openMenu.emit(this.id || null);
    }
  }

  public onCloseMenu(): void {
    if (this.closeMenu.observers.length > 0) {
      this.closeMenu.emit(this.id || null);
    }
  }

  public itemIsDisabled(item: MenuItem): boolean {
    return isFunction(item.disabled)
      ? item.disabled(item)
      : Boolean(item.disabled);
  }

  public trackBy(index: number, item: MenuItem): string {
    return (
      (item.key !== undefined && item.key) || item.label || JSON.stringify(item)
    );
  }

  private setViewModel(): void {
    this.menuViewModel = this.menu.map(item => {
      const enrichedItem = {
        ...item,
        ...(this.id && { id: this.id }),
        ...(this.data && { data: this.data }),
        clickToOpenSub: Boolean(this.clickToOpenSub),
      };
      enrichedItem.disabled = this.itemIsDisabled(enrichedItem);
      return enrichedItem;
    });
  }
}
