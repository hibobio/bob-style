import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { TabsComponent } from './tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsType } from './tabs.enum';
import { ChangeDetectionStrategy } from '@angular/core';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTabsModule, BrowserAnimationsModule],
      declarations: [TabsComponent],
      providers: [EventManagerPlugins[0]],
    })
      .overrideComponent(TabsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    component.tabs = [
      {
        label: 'tab 1',
        key: 'tab-one',
      },
      {
        label: 'tab 2',
      },
      {
        label: 'tab 3',
      },
    ];
    spyOn(component.selectChange, 'emit');
    spyOn(component.selectClick, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tabs', () => {
    it('should have 3 tabs', () => {
      const tabEls = fixture.debugElement.queryAll(By.css('.mat-tab-label'));
      expect(tabEls.length).toEqual(3);
    });

    it('should to set type (style)', () => {
      component.type = TabsType.secondary;
      fixture.detectChanges();

      const tabsGroupEl = fixture.debugElement.query(By.css('.mat-tab-nav-bar'))
        .nativeElement;
      expect(tabsGroupEl.classList).not.toContain('tabs-primary');
      expect(tabsGroupEl.classList).toContain('tabs-secondary');
    });

    it('should to set selected tab via selectedIndex', () => {
      component.selectedIndex = 2;
      fixture.detectChanges();
      const labelEl = fixture.debugElement.query(
        By.css('.mat-tab-label:nth-child(3)')
      ).nativeElement;
      expect(labelEl.classList).toContain('mat-tab-label-active');
    });

    it('should output selectChange event', fakeAsync(() => {
      component.selectChange.subscribe(() => {});
      component.selectedIndex = 1;
      fixture.detectChanges();
      const label = fixture.debugElement.query(
        By.css('.mat-tab-label:nth-child(1)')
      ).nativeElement;
      label.click();
      fixture.detectChanges();
      tick(500);
      expect(component.selectChange.emit).toHaveBeenCalledTimes(1);
      component.selectChange.complete();
    }));

    it('should not change the selected index if the tab is controlled', fakeAsync(() => {
      component.controlled = true;
      component.selectedIndex = 1;
      fixture.detectChanges();
      const label = fixture.debugElement.query(
        By.css('.mat-tab-label:nth-child(1)')
      ).nativeElement;
      label.click();
      fixture.detectChanges();
      tick(500);
      expect(component.selectedIndex).toEqual(1);
    }));

    it('should output select click event', () => {
      component.selectedIndex = 1;
      component.selectClick.subscribe(() => {});
      fixture.detectChanges();
      const label = fixture.debugElement.query(
        By.css('.mat-tab-label:nth-child(2)')
      ).nativeElement;
      label.click();
      expect(component.selectClick.emit).toHaveBeenCalledTimes(1);
      expect(component.selectClick.emit).toHaveBeenCalledWith({
        index: 1,
        tab: {
          label: 'tab 2',
        },
      });
      component.selectClick.complete();
    });

    it('should add class from key param when exists in model', () => {
      fixture.detectChanges();
      const label = fixture.debugElement.query(
        By.css('.mat-tab-label:nth-child(1)')
      ).nativeElement;
      expect(label.classList).toContain('tab-one');
    });
  });
});
