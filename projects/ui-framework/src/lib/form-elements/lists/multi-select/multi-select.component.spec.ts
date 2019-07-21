import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { PanelPositionService } from '../../../popups/panel/panel-position-service/panel-position.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MultiSelectComponent } from './multi-select.component';
import { MultiListModule } from '../multi-list/multi-list.module';
import { By } from '@angular/platform-browser';
import { SelectGroupOption } from '../list.interface';
import { ListModelService } from '../list-service/list-model.service';
import { cloneDeep } from 'lodash';
import { ListChange } from '../list-change/list-change';
import { TruncateTooltipModule } from '../../../services/truncate-tooltip/truncate-tooltip.module';

describe('MultiSelectComponent', () => {
  let component;
  let optionsMock: SelectGroupOption[];
  let fixture: ComponentFixture<MultiSelectComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;

  beforeEach(async(() => {
    optionsMock = [
      {
        groupName: 'Basic Info',
        options: [
          { value: 'Basic Info 1', id: 1, selected: true },
          { value: 'Basic Info 2', id: 2, selected: false }
        ]
      },
      {
        groupName: 'Personal',
        options: [
          { value: 'Personal 1', id: 11, selected: true },
          { value: 'Personal 2', id: 12, selected: false }
        ]
      }
    ];

    TestBed.configureTestingModule({
      declarations: [MultiSelectComponent],
      providers: [PanelPositionService, ListModelService],
      imports: [
        MultiListModule,
        OverlayModule,
        NoopAnimationsModule,
        CommonModule,
        ButtonsModule,
        TruncateTooltipModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiSelectComponent);
        component = fixture.componentInstance;
        component.options = optionsMock;
        spyOn(component.selectChange, 'emit');
        spyOn(component.selectModified, 'emit');
        spyOn(component.selectCancelled, 'emit');
        spyOn(component, 'propagateChange');
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

  describe('OnInit', () => {
    it('should set selectedValuesMap', () => {
      expect(component.selectedValuesMap).toEqual([1, 11]);
    });
    it('should set trigger value', () => {
      expect(component.triggerValue).toEqual('Basic Info 1, Personal 1');
    });
  });

  describe('OnChanges', () => {
    beforeEach(() => {
      const newOptionsMock: SelectGroupOption[] = cloneDeep(optionsMock);
      newOptionsMock[0].options[0].selected = false;
      newOptionsMock[1].options[0].selected = false;
      newOptionsMock[1].options[1].selected = true;
      component.ngOnChanges({
        options: {
          previousValue: undefined,
          currentValue: newOptionsMock,
          firstChange: false,
          isFirstChange: () => false
        }
      });
    });
    it('should update selectedValuesMap', () => {
      expect(component.selectedValuesMap).toEqual([12]);
    });
    it('should update trigger value when options update', () => {
      expect(component.triggerValue).toEqual('Personal 2');
    });
  });

  describe('onSelect', () => {
    it('should update selectedValuesMap and triggerValue', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      expect(component.selectedValuesMap).toEqual([1, 11, 12]);
      expect(component.triggerValue).toEqual(
        'Basic Info 1, Personal 1, Personal 2'
      );
      flush();
    }));
    it('should emit onSelectModified with listChange', fakeAsync(() => {
      const expectedOptionsMock: SelectGroupOption[] = cloneDeep(optionsMock);
      expectedOptionsMock[1].options[1].selected = true;
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      const expectedListChange = new ListChange(expectedOptionsMock);
      expect(component.selectModified.emit).toHaveBeenCalledWith(
        expectedListChange
      );
      flush();
    }));
  });

  describe('selectChange', () => {
    it('should emit onSelect with listChange and propagateChange with selectedValuesArray', fakeAsync(() => {
      const expectedListChange = new ListChange(optionsMock);
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      const applyButton = overlayContainerElement.querySelector(
        'b-list-footer .apply-button'
      ) as HTMLElement;
      applyButton.click();
      expect(component.selectChange.emit).toHaveBeenCalledWith(
        expectedListChange
      );
      expect(component.propagateChange).toHaveBeenCalledWith([1, 11]);
      flush();
    }));
    it('should close the panel on apply', fakeAsync(() => {
      spyOn(component, 'destroyPanel');
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      const applyButton = overlayContainerElement.querySelector(
        'b-list-footer .apply-button'
      ) as HTMLElement;
      applyButton.click();
      expect(component.destroyPanel).toHaveBeenCalled();
      flush();
    }));
  });

  describe('cancelSelection', () => {
    it('should close the panel', fakeAsync(() => {
      spyOn(component, 'destroyPanel');
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      const cancelButton = overlayContainerElement.querySelector(
        'b-list-footer .cancel-button'
      ) as HTMLElement;
      cancelButton.click();
      expect(component.destroyPanel).toHaveBeenCalled();
      flush();
    }));
    it('should emit selectCancelled event and ignore option click in listChange', fakeAsync(() => {
      const expectedListChange = new ListChange(optionsMock);
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      const cancelButton = overlayContainerElement.querySelector(
        'b-list-footer .cancel-button'
      ) as HTMLElement;
      cancelButton.click();
      expect(component.selectCancelled.emit).toHaveBeenCalledWith(
        expectedListChange
      );
      flush();
    }));
  });

  describe('clear -> apply', () => {
    let expectedOptionsMock: SelectGroupOption[];
    beforeEach(() => {
      expectedOptionsMock = cloneDeep(optionsMock);
      expectedOptionsMock[0].options[0].selected = false;
      expectedOptionsMock[1].options[0].selected = false;
    });
    it('should clear the selection from options, selectedValuesMap and empty triggerValue', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      fixture.autoDetectChanges();
      const clearButton = overlayContainerElement.querySelector(
        'b-list-footer .clear-button'
      ) as HTMLElement;
      clearButton.click();
      const applyButton = overlayContainerElement.querySelector(
        'b-list-footer .apply-button'
      ) as HTMLElement;
      applyButton.click();
      fixture.autoDetectChanges();
      expect(component.selectedValuesMap).toEqual([]);
      expect(component.triggerValue).toEqual('');
      expect(component.options).toEqual(expectedOptionsMock);
      flush();
    }));
    it('should invoke selectChange.emit with listChange and propagateChange with []', fakeAsync(() => {
      const expectedListChange = new ListChange(expectedOptionsMock);
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      fixture.autoDetectChanges();
      const clearButton = overlayContainerElement.querySelector(
        'b-list-footer .clear-button'
      ) as HTMLElement;
      clearButton.click();
      const applyButton = overlayContainerElement.querySelector(
        'b-list-footer .apply-button'
      ) as HTMLElement;
      applyButton.click();
      fixture.autoDetectChanges();
      expect(component.selectChange.emit).toHaveBeenCalledWith(
        expectedListChange
      );
      expect(component.propagateChange).toHaveBeenCalledWith([]);
      flush();
    }));
  });

  describe('clear -> cancel', () => {
    it('should reset the selection from options, selectedValuesMap and reset triggerValue', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      fixture.autoDetectChanges();
      const clearButton = overlayContainerElement.querySelector(
        'b-list-footer .clear-button'
      ) as HTMLElement;
      clearButton.click();
      const cancelButton = overlayContainerElement.querySelector(
        'b-list-footer .cancel-button'
      ) as HTMLElement;
      cancelButton.click();
      fixture.autoDetectChanges();
      expect(component.selectedValuesMap).toEqual([1, 11]);
      expect(component.triggerValue).toEqual('Basic Info 1, Personal 1');
      expect(component.options).toEqual(optionsMock);
      flush();
    }));
    it('should invoke selectCancelled.emit with listChange and propagateChange with [3]', fakeAsync(() => {
      const expectedListChange = new ListChange(optionsMock);
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      fixture.autoDetectChanges();
      const clearButton = overlayContainerElement.querySelector(
        'b-list-footer .clear-button'
      ) as HTMLElement;
      clearButton.click();
      const cancelButton = overlayContainerElement.querySelector(
        'b-list-footer .cancel-button'
      ) as HTMLElement;
      cancelButton.click();
      fixture.autoDetectChanges();
      expect(component.selectCancelled.emit).toHaveBeenCalledWith(
        expectedListChange
      );
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
      fixture.nativeElement.style.width = '150px';
      spyOn(component.selectChange, 'emit');
    }));
    it('should not show tooltip', () => {
      optionsMock[0].options[0].selected = false;
      component.options = optionsMock;
      fixture.detectChanges();

      const tooltipEl = fixture.debugElement.query(
        By.css('.btt.tooltip-enabled')
      );
      expect(tooltipEl).toBe(null);
    });
    it('should add tooltip', fakeAsync(() => {
      component.options = optionsMock;
      component.openPanel();

      tick(0);
      fixture.detectChanges();

      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();

      tick(0);
      fixture.detectChanges();
      tick(0);

      const tooltipEl = fixture.debugElement.query(
        By.css('.btt.tooltip-enabled')
      );

      expect(tooltipEl).not.toBe(null);
      expect(tooltipEl.nativeElement.innerText).toEqual(
        'Basic Info 1, Personal 1, Personal 2'
      );
      flush();
    }));
  });

  describe('total-values counter', () => {
    it('should put a selected values number in suffix, if tooltip is enabled', fakeAsync(() => {
      fixture.nativeElement.style.width = '200px';
      component.options = optionsMock;
      fixture.detectChanges();
      component.openPanel();
      tick();
      fixture.detectChanges();
      const options = overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      );
      (options[1] as HTMLElement).click();
      (options[3] as HTMLElement).click();
      tick();
      fixture.detectChanges();
      const tooltipEl = fixture.debugElement.query(
        By.css('.btt.tooltip-enabled')
      );
      const totalValuesCounter = fixture.debugElement.query(
        By.css('.total-values')
      ).nativeElement;
      expect(tooltipEl).not.toBe(null);
      expect(totalValuesCounter.innerText).toEqual('(4)');
      flush();
    }));
  });
});
