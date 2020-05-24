import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectionStrategy,
  NgZone,
  ViewChild,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { Tab, TabChangeEvent } from './tabs.interface';
import { MatTabNav, MatTabLink } from '@angular/material/tabs';
import { TabsType } from './tabs.enum';
import {
  notFirstChanges,
  isKey,
  isObject,
} from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { IconSize, IconColor } from '../../icons/icons.enum';
import { BadgeConfig } from '../../avatar/avatar/avatar.interface';
import { AvatarBadges } from '../../avatar/avatar/avatar.consts';
import { AvatarBadge } from '../../avatar/avatar/avatar.enum';

@Component({
  selector: 'b-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements OnChanges, AfterViewInit {
  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}

  @ViewChild(MatTabNav) matTabNav: MatTabNav;
  @ViewChildren(MatTabLink, { read: ElementRef })
  tabLabels: QueryList<ElementRef>;

  @Input() public type: TabsType = TabsType.primary;

  @Input('tabs') set setTabs(tabs: Tab[]) {
    this.tabs = (tabs || []).map((tab) => ({
      ...tab,
      badge: this.processBadge(tab.badge),
    }));
  }
  public tabs: Tab[] = [];

  @Input('selectedIndex') set setSelectedIndex(index: number) {
    this.selectedIndex = index || 0;
  }
  public selectedIndex = 0;

  // This input determines if the tabs will be changed automatically on click.
  @Input() controlled = false;

  @Output() selectChange: EventEmitter<TabChangeEvent> = new EventEmitter<
    TabChangeEvent
  >();
  @Output() selectClick: EventEmitter<TabChangeEvent> = new EventEmitter<
    TabChangeEvent
  >();

  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  ngOnChanges(changes: SimpleChanges): void {
    if (notFirstChanges(changes)) {
      this.cd.detectChanges();
    }

    if (notFirstChanges(changes, ['tabs', 'type'], true)) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.updateTabWidths();
        }, 0);
      });
    }
  }

  ngAfterViewInit(): void {
    this.updateTabWidths();
  }

  public onNavBarClick($event: MouseEvent): void {
    const { index, tab } = this.getTabFromEl($event.target as HTMLElement);

    this.zone.run(() => {
      this.onTabChange(tab, index);
    });
  }

  public onNavBarKeydown($event: KeyboardEvent): void {
    if (isKey($event.key, Keys.enter) || isKey($event.key, Keys.space)) {
      $event.preventDefault();
      $event.stopPropagation();

      const { index, tab } = this.getTabFromEl($event.target as HTMLElement);

      this.zone.run(() => {
        this.onTabChange(tab, index);
      });
    }
  }

  private onTabChange(tab: Tab, index: number): void {
    if (tab && !this.controlled && this.selectedIndex !== index) {
      this.selectedIndex = index;
      this.cd.detectChanges();

      if (this.selectChange.observers.length > 0) {
        this.selectChange.emit({ tab, index });
      }
    }

    if (tab && this.selectClick.observers.length > 0) {
      this.selectClick.emit({ tab, index });
    }
  }

  private getTabFromEl(
    tabEl: HTMLElement
  ): { tabEl: HTMLElement; index: number; tab: Tab } {
    tabEl = tabEl?.closest('.mat-tab-label');
    const index = tabEl && parseInt(tabEl.getAttribute('data-index'), 10);
    const tab = tabEl && this.tabs[index];

    return {
      tabEl,
      index,
      tab,
    };
  }

  private updateTabWidths(): void {
    this.tabLabels.toArray().forEach((label) => {
      const element = label.nativeElement;
      element.style.minWidth = element.scrollWidth + 'px';
    });
  }

  public tabTrackBy(index: number, tab: Tab): string {
    return tab.key || tab.label;
  }

  private processBadge(badge: Tab['badge']): BadgeConfig {
    return badge
      ? ({
          ...(isObject(badge)
            ? badge
            : AvatarBadges[badge as AvatarBadge] || {}),
          iconAttribute: (
            (badge as BadgeConfig).icon ||
            AvatarBadges[badge as AvatarBadge].icon
          ).replace('b-icon-', ''),
        } as BadgeConfig)
      : null;
  }
}
