import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsComponent } from './tabs.component';
import { MatTabsModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatTabsModule, BrowserAnimationsModule ],
      declarations: [ TabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tabs', () => {
    it('Should have 3 tabs', () => {
      component.tabs = [{
        label: 'tab 1',
      },
        {
          label: 'tab 2',
        },
        {
          label: 'tab 3',
        }];
      component.onSelectedTabChange = () => {};
      fixture.detectChanges();
      const progressEl = fixture.debugElement.query(By.css('.mat-tab-header'));
      expect(progressEl.childNodes.length).toEqual(3);
    });
  });
});
