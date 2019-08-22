import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { TabsComponent } from './tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsType } from './tabs.enum';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTabsModule, BrowserAnimationsModule],
      declarations: [TabsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    component.tabs = [
      {
        label: 'tab 1',
        key: 'tab.one'
      },
      {
        label: 'tab 2'
      },
      {
        label: 'tab 3'
      }
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
      const progressEl = fixture.debugElement.query(By.css('.mat-tab-header'));
      expect(progressEl.childNodes.length).toEqual(3);
    });

    it('should to set type (style)', () => {
      component.type = TabsType.secondary;
      fixture.detectChanges();

      const tabsGroupEl = fixture.debugElement.query(By.css('.mat-tab-group'))
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
      component.selectedIndex = 1;
      fixture.detectChanges();
      const matTabLabel = fixture.debugElement.queryAll(
        By.css('.mat-tab-label')
      )[0];
      matTabLabel.triggerEventHandler('click', null);
      fixture.detectChanges();
      tick(500);
      expect(component.selectChange.emit).toHaveBeenCalledTimes(2);
    }));

    it('should output select click event', () => {
      component.selectedIndex = 1;
      fixture.detectChanges();
      const label = fixture.debugElement.queryAll(By.css('.tab-label'))[1];
      label.triggerEventHandler('click', null);
      expect(component.selectClick.emit).toHaveBeenCalledTimes(1);
      expect(component.selectClick.emit).toHaveBeenCalledWith({
        index: 1,
        tab: {
          label: 'tab 2'
        }
      });
    });

    it('should add class from key param when exists in model', () => {
      fixture.detectChanges();
      const tabSpan = fixture.debugElement.queryAll(
        By.css('.mat-tab-label span')
      );
      expect(tabSpan[0].nativeElement.classList).toContain('tab.one');
    });
  });
});
