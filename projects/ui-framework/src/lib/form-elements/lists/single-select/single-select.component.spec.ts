import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SingleSelectComponent } from './single-select.component';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InputModule } from '../../input';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';
import { SingleListModule } from '../single-list/single-list.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconService } from '../../../icons/icon.service';
import { By } from '@angular/platform-browser';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { MultiSelectComponent } from '../multi-select/multi-select.component';

describe('SingleSelectComponent', () => {
  let component: SingleSelectComponent;
  let optionsMock;
  let fixture: ComponentFixture<SingleSelectComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;
  let spyIconService: SpyObj<IconService>;

  beforeEach(async(() => {
    spyIconService = createSpyObj('spyIconService', ['initIcon']);

    optionsMock = [
      {
        groupName: 'Basic Info',
        options: [
          { value: 'Basic Info 1', id: 1 },
          { value: 'Basic Info 2', id: 2 },
        ],
      },
      {
        groupName: 'Personal',
        options: [
          { value: 'Personal 1', id: 11 },
          { value: 'Personal 2', id: 12 },
        ],
      },
    ];

    TestBed.configureTestingModule({
      declarations: [
        SingleSelectComponent,
      ],
      providers: [
        PanelPositionService,
        { provide: IconService, useValue: spyIconService },
      ],
      imports: [
        SingleListModule,
        OverlayModule,
        NoopAnimationsModule,
        CommonModule,
        FormsModule,
        InputModule,
        MatFormFieldModule,
        MatInputModule,
        ButtonsModule,
        FlexLayoutModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SingleSelectComponent);
        component = fixture.componentInstance;
        component.options = optionsMock;
        component.value = 1;
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

  describe('ngOnInit', () => {
    it('should set value as empty array if value is not defined', () => {
      fixture = TestBed.createComponent(SingleSelectComponent);
      component = fixture.componentInstance;
      component.options = optionsMock;
      component.value = undefined;
      fixture.autoDetectChanges();
      expect(component.value).toEqual(null);
    });
    it('should set triggerValue if value is provided', () => {
      expect(component.triggerValue).toEqual('Basic Info 1');
    });
  });

  describe('onSelect', () => {
    it('should emit onSelect with selected value',
      fakeAsync(() => {
        component.openPanel();
        fixture.autoDetectChanges();
        tick(0);
        (overlayContainerElement.querySelectorAll('b-single-list .option')[3] as HTMLElement).click();
        expect(component.value).toEqual(12);
        expect(component.selectChange.emit).toHaveBeenCalledWith(12);
        expect(component.propagateChange).toHaveBeenCalledWith(12);
        flush();
      }));
  });

  describe('clearSelection', () => {
    it('should clear the selection',
      fakeAsync(() => {
        component.openPanel();
        fixture.autoDetectChanges();
        tick(0);
        (overlayContainerElement.querySelectorAll('b-single-list .option')[3] as HTMLElement).click();
        fixture.autoDetectChanges();
        const clearSelection = fixture.debugElement.query(By.css('.clear-selection'));
        clearSelection.triggerEventHandler('click', null);
        fixture.autoDetectChanges();
        expect(component.value).toBe(null);
        expect(component.triggerValue).toBe(null);
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
      fixture = TestBed.createComponent(SingleSelectComponent);
      component = fixture.componentInstance;
      fixture.nativeElement.style.width = '200px';
      component.options = optionsMock;
      component.options[1].options[1].value = 'a very long text that has a tooltip';
      component.value = 1;
      spyOn(component.selectChange, 'emit');
      fixture.autoDetectChanges();
    }));
    it('should not show tooltip', () => {
      const inputEl = fixture.debugElement.query(By.css('b-input'));
      expect(inputEl.properties.matTooltip).toBe(null);
    });
    it('should add tooltip',
      fakeAsync(() => {
        component.openPanel();
        fixture.autoDetectChanges();
        tick(0);
        (overlayContainerElement.querySelectorAll('b-single-list .option')[3] as HTMLElement).click();
        fixture.autoDetectChanges();
        tick(0);
        const inputEl = fixture.debugElement.query(By.css('b-input'));
        expect(inputEl.properties.matTooltip).toEqual('a very long text that has a tooltip');
        flush();
      }));
  });

});
