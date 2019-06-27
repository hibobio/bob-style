import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
        key: 'tab.one',
      },
      {
        label: 'tab 2',
      },
      {
        label: 'tab 3',
      }
    ];
    spyOn(component.selectChange, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tabs', () => {
    it('Should have 3 tabs', () => {
      const progressEl = fixture.debugElement.query(By.css('.mat-tab-header'));
      expect(progressEl.childNodes.length).toEqual(3);
    });

    it('Should be able to set type (style)', () => {
      component.type = TabsType.secondary;
      fixture.detectChanges();

      const tabsGroupEl = fixture.debugElement.query(By.css('.mat-tab-group'))
        .nativeElement;
      expect(tabsGroupEl.classList).not.toContain('tabs-primary');
      expect(tabsGroupEl.classList).toContain('tabs-secondary');
    });

    it('Should be able to set selected tab via selectedIndex', () => {
      component.selectedIndex = 2;
      fixture.detectChanges();
      const labelEl = fixture.debugElement.query(
        By.css('.mat-tab-label:nth-child(3)')
      ).nativeElement;
      expect(labelEl.classList).toContain('mat-tab-label-active');
    });

    it('Should output selectChange event', () => {
      component.selectedIndex = 1;
      expect(component.selectChange.emit).not.toHaveBeenCalled();
    });

    it('should add class from key param when exists in model', () => {
      fixture.detectChanges();
      const tabSpan = fixture.debugElement.queryAll(
        By.css('.mat-tab-label span'));
      expect(tabSpan[0].nativeElement.classList).toContain('tab.one');
    });
  });
});
