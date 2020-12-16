import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
  resetFakeAsyncZone,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteComponent } from './auto-complete.component';
import { AutoCompleteModule } from './auto-complete.module';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { AutoCompleteOption } from './auto-complete.interface';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { AutoCompletePanelComponent } from './auto-complete-panel/auto-complete-panel.component';
import { SearchComponent } from '../search/search.component';
import { SearchModule } from '../search/search.module';

describe('AutoCompleteComponent', () => {
  let component: AutoCompleteComponent;
  let fixture: ComponentFixture<AutoCompleteComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;
  let optionsMock: AutoCompleteOption[];

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(async(() => {
    optionsMock = Array.from(Array(12), (_, k) => {
      return {
        value: `Basic Info E${k} - option`,
        subText: `subtext e${k}`,
        id: k.toString(),
      };
    });

    TestBed.configureTestingModule({
      declarations: [
        MockComponent(SearchComponent),
        MockComponent(AutoCompletePanelComponent),
      ],
      imports: [
        NoopAnimationsModule,
        AutoCompleteModule,
        OverlayModule,
        SearchModule,
      ],
      providers: [],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AutoCompleteComponent);
        component = fixture.componentInstance;
        spyOn(component.optionSelect, 'emit');
        spyOn(component.searchChange, 'emit');
        component.ngOnChanges({
          options: {
            previousValue: undefined,
            currentValue: optionsMock,
            firstChange: true,
            isFirstChange: () => true,
          },
        });
        fixture.autoDetectChanges();
      });

    inject(
      [OverlayContainer, Platform],
      (oc: OverlayContainer, p: Platform) => {
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
        platform = p;
      }
    )();
  }));

  describe('OnChanges', () => {
    it('should update filtered list', () => {
      expect(component.filteredOptions).toEqual(optionsMock);
    });
  });

  describe('searchChange', () => {
    it('should open panel if search has value', () => {
      let panel = overlayContainerElement.querySelector(
        'b-auto-complete-panel'
      );
      expect(panel).toBeFalsy();
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      searchEl.componentInstance.searchChange.emit('e1');
      fixture.autoDetectChanges();

      panel = overlayContainerElement.querySelector('b-auto-complete-panel');
      expect(panel).toBeTruthy();
    });
    it('should close panel if search has empty value', () => {
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      searchEl.componentInstance.searchChange.emit('e1');
      fixture.autoDetectChanges();

      let panel = overlayContainerElement.querySelector(
        'b-auto-complete-panel'
      );
      expect(panel).toBeTruthy();
      searchEl.componentInstance.searchChange.emit('');
      fixture.autoDetectChanges();
      panel = overlayContainerElement.querySelector('b-auto-complete-panel');
      expect(panel).toBeFalsy();
    });
    it('should update filtered list based on search value', () => {
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      searchEl.componentInstance.searchChange.emit('e1');
      expect(component.filteredOptions).toEqual([
        optionsMock[1],
        optionsMock[10],
        optionsMock[11],
      ]);
    });
    it('should have panel open if filteredList.length > 0', () => {
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      searchEl.componentInstance.searchChange.emit('e1');
      fixture.autoDetectChanges();

      const panel = overlayContainerElement.querySelector(
        'b-auto-complete-panel'
      );
      expect(panel).toBeTruthy();
    });
    it('should have panel close if filteredList.length=0', () => {
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      searchEl.componentInstance.searchChange.emit('abcdef');
      fixture.autoDetectChanges();

      const panel = overlayContainerElement.querySelector(
        'b-auto-complete-panel'
      );
      expect(panel).toBeFalsy();
    });
    it('should emit search value', () => {
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      searchEl.componentInstance.searchChange.emit('abcdef');
      expect(component.searchChange.emit).toHaveBeenCalledWith('abcdef');
    });
  });

  describe('onSearchFocus', () => {
    it('should note open panel if displayOptionsOnFocus = false', () => {
      component.displayOptionsOnFocus = false;
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      searchEl.componentInstance.searchFocus.emit();
      fixture.autoDetectChanges();

      const panel = overlayContainerElement.querySelector(
        'b-auto-complete-panel'
      );
      expect(panel).toBeFalsy();
    });
    it('should open panel if displayOptionsOnFocus = true', () => {
      component.displayOptionsOnFocus = true;
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      searchEl.componentInstance.searchFocus.emit();
      fixture.autoDetectChanges();

      const panel = overlayContainerElement.querySelector(
        'b-auto-complete-panel'
      );
      expect(panel).toBeTruthy();
    });
  });

  describe('optionClick', () => {
    it('should emit optionSelect with option', fakeAsync(() => {
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      searchEl.componentInstance.searchChange.emit('e1');
      fixture.autoDetectChanges();
      tick(0);

      (overlayContainerElement.querySelectorAll(
        '.option-select'
      )[0] as HTMLElement).click();
      expect(component.optionSelect.emit).toHaveBeenCalledWith(optionsMock[1]);
      flush();
    }));
  });

  describe('OnDestroy', () => {
    it('should destroy panel', () => {
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      searchEl.componentInstance.searchChange.emit('e1');
      fixture.autoDetectChanges();

      component.ngOnDestroy();
      expect(component['subscribtions']).toEqual([]);
      expect(component['panelOpen']).toBe(false);
    });
  });
});
