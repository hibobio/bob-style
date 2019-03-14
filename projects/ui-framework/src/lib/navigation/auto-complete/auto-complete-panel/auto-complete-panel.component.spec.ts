import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompletePanelComponent } from './auto-complete-panel.component';
import { IconService } from '../../../icons/icon.service';
import { ListKeyboardService, NavigationKeys } from '../../../form-elements/lists/list-service/list-keyboard.service';
import { AutoCompleteOption } from '../auto-complete.interface';
import { By } from '@angular/platform-browser';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FiltersModule } from '../../../services/filters/filters.module';
import { TypographyModule } from '../../../typography/typography.module';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('AutoCompletePanelComponent', () => {
  let component: AutoCompletePanelComponent;
  let fixture: ComponentFixture<AutoCompletePanelComponent>;
  let spyIconService: SpyObj<IconService>;
  let optionsMock: AutoCompleteOption[];

  beforeEach(async(() => {
    spyIconService = createSpyObj('spyIconService', ['initIcon']);

    optionsMock = Array.from(Array(12), (_, k) => {
      return {
        value: `Basic Info E${ k } - option`,
        subText: `subtext e${ k }`,
        id: k,
      };
    });

    TestBed.configureTestingModule({
      declarations: [
        AutoCompletePanelComponent,
      ],
      providers: [
        ListKeyboardService,
        { provide: IconService, useValue: spyIconService },
      ],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        ScrollingModule,
        FiltersModule,
        TypographyModule,
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AutoCompletePanelComponent);
        component = fixture.componentInstance;
        spyOn(component.optionSelect, 'emit');
        spyOn(component.escapeClick, 'emit');
        component.ngOnChanges({
          options: {
            previousValue: undefined, currentValue: optionsMock, firstChange: true, isFirstChange: () => true,
          },
        });
        fixture.autoDetectChanges();
      });
  }));

  describe('OnChanges', () => {
    it('should set the first option of list as focus', () => {
      const option = fixture.debugElement.queryAll(By.css('.option-select'))[0];
      expect(option.nativeElement.classList).toContain('focus');
    });
    it('should rerender options when model changes', () => {
      let options = fixture.debugElement.queryAll(By.css('.option-select'));
      expect(options.length).toEqual(12);
      component.ngOnChanges({
        options: {
          previousValue: undefined, currentValue: [optionsMock[0], optionsMock[1]], firstChange: false, isFirstChange: () => false,
        },
      });
      fixture.autoDetectChanges();
      options = fixture.debugElement.queryAll(By.css('.option-select'));
      expect(options.length).toEqual(2);
    });
  });

  describe('ngOnInit', () => {
    it('should listen to NavigationKeys.down and update focus option to second option', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: NavigationKeys.down }));
      fixture.autoDetectChanges();
      const option = fixture.debugElement.queryAll(By.css('.option-select'))[1];
      expect(option.nativeElement.classList).toContain('focus');
    });
    it('should listen to NavigationKeys.up and update focus option to second option', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: NavigationKeys.up }));
      fixture.autoDetectChanges();
      const option = fixture.debugElement.queryAll(By.css('.option-select'))[optionsMock.length - 1];
      expect(option.nativeElement.classList).toContain('focus');
    });
    it('should listen to NavigationKeys.Enter and emit option click', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: NavigationKeys.down }));
      document.dispatchEvent(new KeyboardEvent('keydown', { code: NavigationKeys.enter }));
      expect(component.optionSelect.emit).toHaveBeenCalledWith(optionsMock[1]);
    });
    it('should listen to escape and emit escape event', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: NavigationKeys.escape }));
      expect(component.escapeClick.emit).toHaveBeenCalled();
    });
  });

  describe('optionClick', () => {
    it('should emit selected option', () => {
      const option = fixture.debugElement.queryAll(By.css('.option-select'))[5];
      option.triggerEventHandler('click', null);
      expect(component.optionSelect.emit).toHaveBeenCalledWith(optionsMock[5]);
    });
  });

  describe('OnDestroy', () => {
    it('should unsubscribe keyDownSubscriber', () => {
      expect(component['keyDownSubscriber'].closed).toBe(false);
      component.ngOnDestroy();
      expect(component['keyDownSubscriber'].closed).toBe(true);
    });
  });
});
