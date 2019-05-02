import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SingleSelectComponent } from './single-select.component';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { InputModule } from '../../input/input.module';
import { PanelPositionService } from '../../../overlay/panel/panel-position-service/panel-position.service';
import { SingleListModule } from '../single-list/single-list.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconService } from '../../../icons/icon.service';
import { By } from '@angular/platform-browser';
import { SelectGroupOption } from '../list.interface';
import { cloneDeep } from 'lodash';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { ListFooterModule } from '../list-footer/list-footer.module';

describe('SingleSelectComponent', () => {
  let component: SingleSelectComponent;
  let optionsMock: SelectGroupOption[];
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
          { value: 'Basic Info 1', id: 1, selected: true },
          { value: 'Basic Info 2', id: 2, selected: false },
        ]
      },
      {
        groupName: 'Personal',
        options: [
          { value: 'Personal 1', id: 11, selected: false },
          { value: 'Personal 2', id: 12, selected: false },
        ]
      }
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
        ListFooterModule,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SingleSelectComponent);
        component = fixture.componentInstance;
        spyOn(component.selectChange, 'emit');
        spyOn(component, 'propagateChange');
        component.ngOnChanges({
          options: {
            previousValue: undefined,
            currentValue: optionsMock,
            firstChange: true,
            isFirstChange: () => true,
          }
        });
        fixture.autoDetectChanges();
      });

    inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      platform = p;
    })();
  }));

  describe('ngOnChanges', () => {
    it('should set triggerValue for selected options', () => {
      expect(component.triggerValue).toEqual('Basic Info 1');
    });
    it('should update trigger value also when options update', () => {
      const testOptionsMock = cloneDeep(optionsMock);
      testOptionsMock[0].options[0].selected = false;
      component.ngOnChanges({
        options: {
          previousValue: optionsMock,
          currentValue: testOptionsMock,
          firstChange: false,
          isFirstChange: () => false,
        }
      });
      expect(component.triggerValue).toBe(null);
      testOptionsMock[1].options[0].selected = true;
      component.ngOnChanges({
        options: {
          previousValue: optionsMock,
          currentValue: testOptionsMock,
          firstChange: false,
          isFirstChange: () => false,
        }
      });
      expect(component.triggerValue).toEqual('Personal 1');
    });
  });

  describe('onSelect', () => {
    it('should emit onSelect with list change and propagateChange with selected value', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll('b-single-list .option')[3] as HTMLElement).click();
      const listChange = component['listChangeService'].getListChange(optionsMock, [12]);
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
      expect(component.propagateChange).toHaveBeenCalledWith(12);
      flush();
    }));
  });

  describe('clearSelection', () => {
    it('should clear the selection', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      const clearButton = overlayContainerElement
        .querySelectorAll('b-list-footer .clear b-button')[0] as HTMLElement;
      clearButton.click();
      fixture.autoDetectChanges();
      expect(component.triggerValue).toBe(null);
      flush();
    }));
    it('should invoke selectChange.emit and propagateChange with null', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      const clearButton = overlayContainerElement
        .querySelectorAll('b-list-footer .clear b-button')[0] as HTMLElement;
      clearButton.click();
      fixture.autoDetectChanges();
      const listChange = component['listChangeService'].getListChange(optionsMock, []);
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
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
      const testOptionsMock = cloneDeep(optionsMock);
      testOptionsMock[1].options[1].value = 'a very long text that has a tooltip';
      fixture = TestBed.createComponent(SingleSelectComponent);
      component = fixture.componentInstance;
      spyOn(component.selectChange, 'emit');
      fixture.nativeElement.style.width = '200px';
      component.ngOnChanges({
        options: {
          previousValue: undefined,
          currentValue: testOptionsMock,
          firstChange: true,
          isFirstChange: () => true,
        }
      });
      fixture.autoDetectChanges();
    }));
    it('should not show tooltip', () => {
      const inputEl = fixture.debugElement.query(By.css('b-input'));
      expect(inputEl.properties.matTooltip).toBe(null);
    });
    it('should add tooltip', fakeAsync(() => {
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
