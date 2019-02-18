import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { InputModule } from '../../input';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconService } from '../../../icons/icon.service';
import { MultiSelectComponent } from './multi-select.component';
import { MultiListModule } from '../multi-list/multi-list.module';
import { By } from '@angular/platform-browser';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('MultiSelectComponent', () => {
  let component;
  let optionsMock;
  let fixture: ComponentFixture<MultiSelectComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;
  let spyIconService: SpyObj<IconService>;

  beforeEach(async(() => {
    spyIconService = createSpyObj('spyIconService', ['initIcon']);
    optionsMock = [
      {
        groupName: 'Basic Info',
        options: [{ value: 'Basic Info 1', id: 1 }, { value: 'Basic Info 2', id: 2 }]
      },
      {
        groupName: 'Personal',
        options: [{ value: 'Personal 1', id: 11 }, { value: 'Personal 2', id: 12 }]
      }
    ];

    TestBed.configureTestingModule({
      declarations: [MultiSelectComponent],
      providers: [PanelPositionService, { provide: IconService, useValue: spyIconService }],
      imports: [
        MultiListModule,
        OverlayModule,
        NoopAnimationsModule,
        CommonModule,
        FormsModule,
        InputModule,
        MatFormFieldModule,
        MatInputModule,
        ButtonsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiSelectComponent);
        component = fixture.componentInstance;
        component.options = optionsMock;
        component.value = [1, 11];
        spyOn(component.selectChange, 'emit');
        spyOn(component, 'propagateChange');
        fixture.autoDetectChanges();
      });

    inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      platform = p;
    })();
  }));

  xdescribe('ngOnChanges', () => {
    it('should set value as empty array if value is not defined', () => {
      fixture = TestBed.createComponent(MultiSelectComponent);
      component = fixture.componentInstance;
      component.options = optionsMock;
      component.ngAfterViewInit();
      fixture.autoDetectChanges();
      expect(component.value).toEqual([]);
    });
    it('should set triggerValue if value is provided', () => {
      component.ngAfterViewInit();
      expect(component.triggerValue).toEqual('Basic Info 1, Personal 1');
    });
  });

  describe('onSelect', () => {
    it('should update value and triggerValue', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll('b-multi-list .option')[3] as HTMLElement).click();
      expect(component.value).toEqual([1, 11, 12]);
      expect(component.triggerValue).toEqual('Basic Info 1, Personal 1, Personal 2');
      flush();
    }));
  });

  describe('notifySelectionIds', () => {
    it('should emit onSelect with selected value', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelector('.apply-button') as HTMLElement).click();
      expect(component.selectChange.emit).toHaveBeenCalledWith([1, 11]);
      expect(component.propagateChange).toHaveBeenCalledWith([1, 11]);
      flush();
    }));
  });

  describe('cancelSelection', () => {
    it('should close the panel', fakeAsync(() => {
      spyOn(component, 'destroyPanel');
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelector('.cancel-button') as HTMLElement).click();
      expect(component.destroyPanel).toHaveBeenCalled();
      flush();
    }));
  });

  describe('clearSelection', () => {
    it('should clear the selection', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll('b-multi-list .option')[3] as HTMLElement).click();
      fixture.autoDetectChanges();
      const clearSelection = fixture.debugElement.query(By.css('.clear-selection'));
      clearSelection.triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      expect(component.value).toEqual([]);
      expect(component.triggerValue).toEqual('');
      flush();
    }));
  });

  describe('OnDestroy', () => {
    it('should invoke panel close', () => {
      spyOn(component, 'destroyPanel');
      component.ngOnDestroy();
      expect(component.destroyPanel).toHaveBeenCalled();
    });
  });

  describe('tooltip', () => {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(MultiSelectComponent);
      component = fixture.componentInstance;
      fixture.nativeElement.style.width = '200px';
      component.options = optionsMock;
      component.value = [1];
      spyOn(component.selectChange, 'emit');
      fixture.autoDetectChanges();
    }));
    it('should not show tooltip', () => {
      const tooltipEl = fixture.debugElement.query(By.css('.trigger-tooltip'));
      expect(tooltipEl).toBe(null);
    });
    it('should add tooltip', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll('b-multi-list .option')[3] as HTMLElement).click();
      fixture.autoDetectChanges();
      tick(0);
      const tooltipEl = fixture.debugElement.query(By.css('b-input'));

      expect(tooltipEl).not.toBe(null);
      expect(tooltipEl.properties.matTooltip).toEqual('Basic Info 1, Personal 2');
      flush();
    }));
  });
});
