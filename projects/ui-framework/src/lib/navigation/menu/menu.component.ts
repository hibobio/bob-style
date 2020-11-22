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
  ViewChildren,
  QueryList,
  HostBinding,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { MenuItem } from './menu.interface';
import { MenuPositionX, MatMenu, MatMenuTrigger } from '@angular/material/menu';
import {
  isFunction,
  hasChanges,
  applyChanges,
  notFirstChanges,
  isValuevy,
  isKey,
} from '../../services/utils/functional-utils';
import { UtilsService } from '../../services/utils/utils.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Keys } from '../../enums';

@Component({
  selector: 'b-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnChanges, OnInit, OnDestroy {
  constructor(
    private utilsService: UtilsService,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChild(MatMenuTrigger, { static: true })
  public matMenuTrigger: MatMenuTrigger;

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
  @ViewChildren(MenuComponent)
  public submenus: QueryList<MenuComponent>;

  public menuDir: MenuPositionX = 'after';
  public menuViewModel: MenuItem[];
  private windowKeydownSubscriber: Subscription;

  @HostBinding('attr.data-menu-open') menuOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        menu: [],
      },
      [],
      true
    );

    if (hasChanges(changes, ['openLeft'])) {
      this.menuDir = this.openLeft ? 'before' : 'after';
    }

    if (
      hasChanges(changes, ['menu', 'id', 'data', 'clickToOpenSub'], true, {
        truthyCheck: isValuevy,
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

    this.windowKeydownSubscriber = this.utilsService
      .getWindowKeydownEvent(true)
      .pipe(filter((event: KeyboardEvent) => isKey(event.key, Keys.escape)))
      .subscribe(() => {
        this.zone.run(() => {
          this.close();
        });
      });
  }

  ngOnDestroy() {
    this.windowKeydownSubscriber?.unsubscribe();
  }

  public close(): void {
    this.matMenuTrigger?.closeMenu();
  }

  public open(): void {
    this.matMenuTrigger?.openMenu();
  }

  public onClick(item: MenuItem, triggerAction = true): void {
    if (this.actionClick.observers.length > 0) {
      this.actionClick.emit(item);
    }

    if (item.action && triggerAction) {
      item.action(item);
    }
  }

  public onOpenMenu(): void {
    this.menuOpen = true;
    if (this.openMenu.observers.length > 0) {
      this.openMenu.emit(this.id || null);
    }
  }

  public onCloseMenu(): void {
    this.menuOpen = false;
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
    this.menuViewModel =
      this.menu?.map((item) => ({
        ...item,
        ...(this.id && { id: this.id }),
        ...(this.data && { data: this.data }),
        clickToOpenSub: Boolean(this.clickToOpenSub || item.clickToOpenSub),
      })) || [];
  }
}
